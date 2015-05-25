var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Travel = mongoose.model('Travel');
var Destination = mongoose.model('Destination');
var PointOfInterest = mongoose.model('PointOfInterest');
var User = mongoose.model('User');
var passport = require('passport');
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});

router.post('/travels/:travel/destinations', auth, checkPermission, function(req, res, next) {
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
});

router.get('/destinations/:destination', auth, checkPermission, function(req, res, next) {
  req.destination.populate(['pointsOfInterest', 'lodging'], function(err, destination) {
    if (err) {
      return next(err);
    }

    res.json(destination);
  });
});

router.post('/destinations/:destination/pointsOfInterest', auth, checkPermission, function(req, res, next) {
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
});

router.post('/destinations/:destination/lodging', auth, checkPermission, function(req, res, next) {
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
});

router.delete('/destinations/:destination/:pointOfInterest', auth, checkPermission, function(req, res, next) {
  req.pointOfInterest.remove(function(err) {
    if (err) throw err;
    res.json();
  });
});

router.delete('/travels/:travel/:destination/dest', auth, checkPermission, function(req, res, next) {
  req.destination.remove(function(err) {
    if (err) throw err;
    res.json();
  });
});

router.param('travel', params(Travel, 'travel'));
router.param('destination', params(Destination, 'destination'));
router.param('pointOfInterest', params(PointOfInterest, 'pointOfInterest'));

module.exports = router;