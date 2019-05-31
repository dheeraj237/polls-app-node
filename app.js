const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');



module.exports = function () {
    let server = express(),
        create,
        start;

    create = (config) => {
        let routes = require('./routes');
        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        // View engine
        server.set('views', path.join(__dirname, 'views'))
        server.set('view engine', 'ejs')
        // Middlewares
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(session({ secret: 'mysecretkey', saveUninitialized: false, resave: false }));
        server.use(bodyParser.json());

        //Connect DB
        mongoose.connect(config.dbHost, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: true
        })

        let p = require('./createPolls');
        p.creatPolls();

        // Set up routes
        routes.init(server);
    };


    start = () => {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function () {
            console.log(`Express server listening on - http://${hostname}:${port}`);
        });
    };
    return {
        create: create,
        start: start
    };
};