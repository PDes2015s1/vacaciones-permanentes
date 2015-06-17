var mongoose = require('mongoose');
var Travel = mongoose.model('Travel');
var Destination = mongoose.model('Destination');
var PointOfInterest = mongoose.model('PointOfInterest');
var User = mongoose.model('User');

var mockReq = {
  payload: {}
};
var mockRes = {}
var nextMockParam = function(err) {
  console.log(err)
};
var info = {};

module.exports = function insert(callback) {
  mongoose.connect('mongodb://localhost/travelstest', function() {
    var user = new User();

    user.username = 'jose';

    user.setPassword('123456');

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      mockReq.payload._id = user._id;
      info.user = user;

      createTravel({
        title: 'America',
        startDate: new Date(2015, 6, 1),
        endDate: new Date(2015, 6, 15),
        user: user._id
      }, function() {
        createDestination({
          title: 'Belgica',
          start: new Date(2015, 6, 4),
          end: new Date(2015, 6, 10),
          user: user._id,
          travel: info.travel
        }, function() {
          callback(mockReq, mockRes, nextMockParam, info);
        })
      })
    });
  });
}

function createTravel(data, callback) {
  var travel = new Travel(data);
  travel.save(function(err, newTravel) {
    if (err) {
      return next(err);
    }
    info.travel = newTravel;
    callback();
  });
}

function createDestination(data, callback) {
  var destination = new Destination(info);
  destination.save(function(err, newDestination) {
    if (err) {
      return next(err);
    }

    info.travel.destinations.push(newDestination);
    info.travel.save(function(err, travel) {
      if (err) {
        return next(err);
      }

      info.destination = newDestination;
      callback();
    });
  });
}