var express = require('express');
var mongoose = require('mongoose');
var Travel = mongoose.model('Travel');
var Destination = mongoose.model('Destination');
var PointOfInterest = mongoose.model('PointOfInterest');
var User = mongoose.model('User');

module.exports = {};

module.exports.create = function(req, res, next) {
  var destination = new Destination(req.body);
  destination.travel = req.travel;
  destination.user = req.payload._id;
  destination.save(function(err, destination) {
    if (err) {
      return next(err);
    }

    req.travel.destinations.push(destination);
    req.travel.save(function(err, travel) {
      if (err) {
        return next(err);
      }

      res.json(destination);
    });
  });
};

module.exports.get = function(req, res, next) {
  req.destination.populate(['pointsOfInterest', 'lodging'], function(err, destination) {
    if (err) {
      return next(err);
    }

    res.json(destination);
  });
};

module.exports.createPoint = function(req, res, next) {
  var pointOfInterest = new PointOfInterest(req.body);
  pointOfInterest.destination = req.destination;

  pointOfInterest.save(function(err, pointOfInterest) {
    if (err) {
      return next(err);
    }

    req.destination.pointsOfInterest.push(pointOfInterest);
    req.destination.save(function(err, destination) {
      if (err) {
        return next(err);
      }

      res.json(pointOfInterest);
    });
  });
};

module.exports.createLodging = function(req, res, next) {
  var pointOfInterest = new PointOfInterest(req.body);

  pointOfInterest.save(function(err, pointOfInterest) {
    if (err) {
      return next(err);
    }

    req.destination.lodging = pointOfInterest;
    req.destination.save(function(err, destination) {
      if (err) {
        return next(err);
      }

      res.json(pointOfInterest);
    });
  });
};

module.exports.removePoint = function(req, res, next) {
  req.pointOfInterest.remove(function(err) {
    if (err) throw err;
    res.json();
  });
};

module.exports.remove = function(req, res, next) {
  req.destination.remove(function(err) {
    if (err) throw err;
    res.json();
  });
};