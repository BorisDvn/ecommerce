const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const app = express();

// parse application/json
app.use(express.json());

/* CORS */
app.use(cors({ //todo check cors -> docker
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));

// Import Routes
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

// Use Routes
app.use('/api/orders', ordersRoute);
app.use('/api/products', productsRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

// Swagger
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
