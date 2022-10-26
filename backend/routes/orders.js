const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

// GET ALL ORDERS
router.get('/', (req, res) => {
    /*
    #swagger.tags = ["orders"]
    #swagger.description = 'Fetch all orders'
    #swagger.responses[200] = {
         description: 'all orders',
         schema: [{
            id: 132,
            title: 'PEGASUS 33',
            description: 'The Zoom Pegasus ....',
            price: 59.99,
            username: 'john'
         }]
     }
     #swagger.responses[404] = {
            description: 'No orders found',
            schema: {message: 'No orders found'}
       }
    */
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'u.username'])
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({message: "No orders found"});
            }

        }).catch(err => res.json(err));
});

// Get Single Order
router.get('/:id', async (req, res) => {
    /*
    #swagger.tags = ["orders"]
    #swagger.description = 'Get Single Order'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Order ID',
        required: 'true',
        type: 'integer'
     }
     #swagger.responses[200] = {
         description: 'all orders',
         schema: [
            {
                "id": 174,
                "title": "PEGASUS 33 Running Shoes For Men",
                "description": "The Nike Zoom Pegasus Turbo 2 is updated with a feather-light upper, while innovative foam brings revolutionary responsiveness to your long-distance training",
                "price": 59.99,
                "image": "https://i.pinimg.com/originals/43/40/8e/43408ee5a8d234752ecf80bbc3832e65.jpg",
                "quantityOrdered": 1
            }
        ]
     }
    */

    let orderId = req.params.id;
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({message: "No orders found"});
            }
        }).catch(err => res.json(err));
});

// Place New Order
router.post('/new', async (req, res) => {
    /*
    #swagger.tags = ["orders"]
    #swagger.description = 'Place New Order'
    #swagger.parameters['prodId'] = {
        in: 'body',
        description: 'user & products'
     }
     */

    let {userId, products} = req.body;

    if (userId !== null && userId > 0) {
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => {

                if ((newOrderId.insertId) > 0) {
                    products.forEach(async (p) => {

                        let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();
                        let inCart = parseInt(p.incart);

                        // Deduct the number of pieces ordered from the quantity in database
                        if (data.quantity > 0) {
                            data.quantity = data.quantity - inCart;
                            if (data.quantity < 0) {
                                data.quantity = 0;
                            }
                        } else {
                            data.quantity = 0;
                        }

                        // Insert order details w.r.t the newly created orderId
                        database.table('orders_details')
                            .insert({
                                order_id: newOrderId.insertId,
                                product_id: p.id,
                                quantity: inCart
                            }).then(() => {
                            database.table('products')
                                .filter({id: p.id})
                                .update({
                                    quantity: data.quantity
                                }).then().catch(err => res.json(err));
                        }).catch(err => res.json(err));
                    });

                } else {
                    res.json({message: 'New order failed while adding order details', success: false});
                }
                res.json({
                    message: `Order successfully placed with order id ${newOrderId.insertId}`,
                    success: true,
                    order_id: newOrderId.insertId,
                    products: products
                })
            }
        ).catch(err => res.json(err));
    } else {
        res.json({message: 'New order failed', success: false});
    }
});

// Payment Gateway
router.post('/payment', (req, res) => {
    /*
    #swagger.tags = ["orders"]
    #swagger.description = 'Payment Gateway - Timeout 8000 😶 ㄟ( ▔, ▔ )ㄏ'
    */
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
});

module.exports = router;
