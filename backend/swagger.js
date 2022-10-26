const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '1.0.1',
        title: 'Ecommerce backend API',
        description: 'Ecommerce backend API with Express',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles =  ['./app']; //['./routes/products', './routes/orders'];

//Building documentation at project startup
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app.js'); // Your project's root file
});

// Building documentation without starting the project -> npm run swagger-autogen
// swaggerAutogen(outputFile, endpointsFiles, doc);
