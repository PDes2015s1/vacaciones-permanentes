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
      callback(mockReq, mockRes, nextMockParam, {
        idUser: user._id
      });
    });
  });
}