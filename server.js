'use strict';

// set up
var http = require('http'),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config/config');

var app = express();
var server = http.createServer(app);

// db connection
mongoose.connect(config.mongo.url);

// passport config
require('./config/passport')(passport, config);

// express app config
require('./config/express')(app, config, passport);

// routes
require('./app/routes')(app);

// start server
server.listen(app.get('port'), function () {
  console.log(config.app.name+' server listening on port '+app.get('port')+' for '+config.env);
});

exports.app = app;
