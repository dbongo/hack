'use strict';

var passport = require('passport'),
    jwt = require('jwt-simple'),
    https = require('https'),
    request = require('request'),
    config = require('../../config/config'),
    User = require('../models/user');


// bearerAuth middleware
function bearerAuth(req, res, next) {
  passport.authenticate('bearer', {session: false}, function(err, user, info) {
    if (err)
      return res.status(500).json(err);
    if (!req.query.access_token)
      return res.status(401).json({message: "An access token must be provided"});
    if (!user)
      return res.status(401).json({message: "Access token has expired or is invalid"});
    req.user = user;
    next();
  })(req, res, next);
}


// generic require signin middleware
function requiresAuth(req, res, next) {
  if (!req.isAuthenticated())
    return res.status(401).json({message: "requires authentication"});
  next();
}


function issueAccessToken(req, res) {
  if (!req.body.grantType)
    return res.status(400).json({message: 'Missing grantType field.'});
  else if (req.body.grantType === 'password') {
    if (!req.body.email)
      return res.status(400).json({message: 'Missing email field.'});
    if (!req.body.password)
      return res.status(400).json({message: 'Missing password field.'});
    User.findOne({'local.email': req.body.email}, function (err, user) {
      if (err)
        return res.status(500).json(err);
      if (!user)
        return res.status(401).json({message: 'Unknown email.'});
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err)
          return res.status(500).json(err);
        if(!isMatch)
          return res.status(401).json({message: 'Invalid password.'});

        var token = issueTokenWithUid(user.id);
        return res.send({access_token: token, user: user});
      });
    });
  } else {
    return res.status(400).json({message: 'Invalid grant type.'});
  }
}


function signup(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  if(!email || !email.length)
    return res.status(400).json({message: 'email is not valid'});
  if(!password || !password.length)
    return res.status(400).json({message: 'password is not valid' });
  User.findOne({'local.email': email}, function (err, user) {
    if (err)
      return next(err);
    if (user)
      return res.status(409).json({message: 'the email is already taken.'});
    user = new User();
    user.local.email = email;
    user.local.password = password;
    user.save(function (err, user) {
      if (err)
        return next(err);
      var token = issueTokenWithUid(user.id);
      return res.send({access_token: token, user: user});
    });
  });
}


function issueTokenWithUid(uid) {
  var curDate = new Date();                                                     // expires in 60 days
  var expires = new Date(curDate.getTime() + (60*24*60*60*1000));
  var token = jwt.encode({
    iss: uid,                                                                   // issuer
    exp: expires.getTime()                                                      // expiration time
  }, config.jwtsecret);
  return token;
}

// public functions and variables
exports.issueAccessToken = issueAccessToken;
exports.bearerAuth = bearerAuth;
exports.requiresAuth = requiresAuth;
exports.signup = signup;
