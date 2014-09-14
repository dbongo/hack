'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/**
 * User Schema
 */
var UserSchema = new Schema({
  local: {email: String, password: String,},
  facebook: {id: String, name: String, email: String, acessToken: String, profilePic: String,}
});

/**
 * Add toJSON option to transform document before returnig the result
 */
UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    if (ret.local && ret.local.password)
      delete ret.local.password;
    if (ret.facebook && ret.facebook.accessToken)
      delete ret.facebook.accessToken;
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
};

/**
 * Pre-save hook for password validation and hashing
 */
UserSchema.pre('save', function(next){
  var user = this;
  if (!user.isModified('local.password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.local.password, salt, function(err, hash) {
      if (err) return next(err);
      user.local.password = hash;
      next();
    });
  });
});

/**
 * Validate password
 */
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt
  .compare(candidatePassword, this.local.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
