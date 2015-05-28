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

router.get('/travels', auth, function(req, res, next) {
  Travel.find({
    'user': req.payload._id
  }, function(err, travels) {
    if (err) {
      return next(err);
    }

    res.json(travels);
  });
});

router.post('/travels', auth, function(req, res, next) {
  var travel = new Travel(req.body);
  travel.user = req.payload._id;
  travel.save(function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
});

router.delete('/travels/:travel', auth, checkPermission, function(req, res, next) {
  req.travel.remove(function(err) {
    if (err) throw err;
    res.json();
  });
});

router.get('/travels/:travel', auth, checkPermission, function(req, res, next) {
  req.travel.populate('destinations', function(err, travel) {
    if (err) {
      return next(err);
    }

    res.json(travel);
  });
});


router.param('travel', params(Travel, 'travel'));

module.exports = router;