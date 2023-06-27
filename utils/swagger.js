"use strict";
const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Express Blob Storage API',
        description: 'A simple Express Blob Storage API for storing files in Azure Blob Storage.',
    },
    host: 'localhost:3030',
    schemes: ['http'],
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/auth/index.js']; //, 'endpointsBook.js'];
/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);