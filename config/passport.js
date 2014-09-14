'use strict';

var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jwt-simple');
var User = require('../app/models/user');

// Bearer Strategy for token authentication
module.exports = function (passport, config) {
  passport.use(new BearerStrategy(function (token, done) {
    var decoded = null;

    try {
      decoded = jwt.decode(token, config.jwtsecret);
    } catch (e) {
      var err = new Error();
      err.message = "Invalid Token: " + e.message;
      return done(err, false);
    }

    if (decoded.exp <= Date.now()) {
      return done(null, false, {message: 'Access token has expired'});
    }

    User.findById(decoded.iss, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      return done(null, user);
    });

  }));
};
