const express = require('express');
const router = express.Router();

const {database} = require('../config/helpers');


/* GET ALL PRODUCTS */
router.get('/', function (req, res) {
    /*
    #swagger.tags = ["products"]
    #swagger.description = 'Fetch all products'
    #swagger.parameters['page'] = {
        in: 'query',
        description: 'Page Query Parameter',
        required: 'false',
        type: 'integer'
     }
     #swagger.parameters['limit'] = {
        in: 'query',
        description: 'set limit of items per page',
        required: 'false',
        type: 'integer'
     }
    #swagger.responses[200] = {description: 'ALL PRODUCTS'}
    */

    const {startValue, endValue} = pageAndLimit(req.query.page, req.query.limit);

    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: "No products found"});
            }
        })
        .catch(err => res.json(err));

});

/* GET ONE PRODUCT*/
router.get('/:prodId', (req, res) => {
    /*
    #swagger.tags = ["products"]
    #swagger.description = 'GET ONE PRODUCT'
    #swagger.parameters['prodId'] = {
        in: 'path',
        description: 'Product ID',
        required: 'true',
        type: 'integer'
     }
     #swagger.responses[200] = {
        description: 'ONE PRODUCT',
        schema: {
            "category": "Electronics",
            "id": 1,
            "name": "PlayStation 4",
            "price": 240.99,
            "quantity": 0,
            "description": "With PS4, gaming becomes a lot more power packed. Ultra-fast processors, high-performance system, real-time game sharing, remote play and lots more makes it the ultimate companion device.",
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSr-iFW5W8n3_jxNKiclAP_k71Fi9PGcojsMUC-vb8zbwJthbBd",
            "images": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSr-iFW5W8n3_jxNKiclAP_k71Fi9PGcojsMUC-vb8zbwJthbBd;
            https://static.toiimg.com/thumb/msid-56933980,width-640,resizemode-4,imgsize-85436/56933980.jpg;
            https://cdn.mos.cms.futurecdn.net/3328be45e8c7fe5194055b4c687fb769-1200-80.jpeg;
            https://img.etimg.com/thumb/width-640,height-480,imgsize-76492,resizemode-1,msid-52464286/46.jpg"
        }
     }
    */

    let productId = req.params.prodId;
    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id',
            'p.images'
        ])
        .filter({'p.id': productId})
        .get()
        .then(prod => {
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({message: `No product found with id ${productId}`});
            }
        }).catch(err => res.json(err));
});

/* GET ALL PRODUCTS FROM ONE CATEGORY */
router.get('/category/:catName', (req, res) => {
    // http://localhost:3000/api/products/category/categoryName?page=1

    /*
    #swagger.tags = ["products"]
    #swagger.description = 'GET ALL PRODUCTS FROM ONE CATEGORY'
    #swagger.parameters['catName'] = {
        in: 'path',
        description: 'category name',
        required: 'true',
        type: 'string'
     }
     #swagger.parameters['page'] = {
        in: 'query',
        description: 'Page Query Parameter',
        required: 'false',
        type: 'integer'
     }
     #swagger.parameters['limit'] = {
        in: 'query',
        description: 'set limit of items per page',
        required: 'false',
        type: 'integer'
     }
     #swagger.responses[200] = {description: 'ALL PRODUCTS FROM ONE CATEGORY'}
    */

    const {startValue, endValue} = pageAndLimit(req.query.page, req.query.limit);

    // Get category title value from param
    const cat_title = req.params.catName;

    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: 1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: `No products found matching the category ${cat_title}`});
            }
        }).catch(err => res.json(err));

});

function pageAndLimit(reqPage, reqLimit) {
    let page = (reqPage !== undefined && reqPage !== 0) ? reqPage : 1;
    const limit = (reqLimit !== undefined && reqLimit !== 0) ? reqLimit : 10; // set limit of items per page

    let startValue;
    let endValue;

    if (page > 0) {
        startValue = (page * limit) - limit; // 0, 10, 20, 30
        endValue = page * limit; // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }

    return {startValue, endValue};
}

module.exports = router;
