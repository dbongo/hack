'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var config = require('./config');

module.exports = function (app, config, passport) {
  app.set('port', process.env.PORT || config.port);
  app.use(express.static(config.root + '/public'));
  if (config.env === "development") {
    app.use(logger('dev'));
  }
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
  app.use(passport.initialize());
};
