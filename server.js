const server = require('./app')();
const config = require('./configs/config');

//create the basic server setup 
server.create(config);

//start the server
server.start();