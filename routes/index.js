var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Travel = mongoose.model('Travel');
var Destination = mongoose.model('Destination');
var PointOfInterest = mongoose.model('PointOfInterest');
var User = mongoose.model('User');
var passport = require('passport');

module.exports = {};
/* GET home page. */
module.exports.index = function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
};

module.exports.register = function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function(err) {
    if (isDuplicateError(err)) {
      return res.status(400).json({
        message: 'The user is already registered'
      });
    }
    if (err) {
      return next(err);
    }

    return res.json({
      token: user.generateJWT()
    });
  });
};

function isDuplicateError(err) {
  return err && err.code == 11000;
}

module.exports.login = function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({
        token: user.generateJWT()
      });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
};