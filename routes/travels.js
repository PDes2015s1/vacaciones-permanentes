var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Travel = mongoose.model('Travel');
var Destination = mongoose.model('Destination');
var PointOfInterest = mongoose.model('PointOfInterest');
var User = mongoose.model('User');

module.exports = {};

module.exports.all = function(req, res, next) {
  Travel.find({
    'user': req.payload._id
  }, function(err, travels) {
    if (err) {
      return next(err);
    }

    res.json(travels);
  });
};

module.exports.create = function(req, res, next) {
  var travel = new Travel(req.body);
  travel.user = req.payload._id;
  travel.save(function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
};

module.exports.remove = function(req, res, next) {
  req.travel.remove(function(err) {
    if (err) throw err;
    res.json();
  });
};

module.exports.get = function(req, res, next) {
  req.travel.populate('destinations', function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
};