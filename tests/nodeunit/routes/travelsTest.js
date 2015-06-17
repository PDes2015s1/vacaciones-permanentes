require('../../../app');
var routes = require('../../../routes/travels');
var data = require('../../../extras/initDataTest');
var mongoose = require('mongoose');

var mockReq;
var mockRes;
var nextMock;

exports.setUp = function(callback) {
  data(function(mockReqParam, mockResParam, nextMockParam, data) {
    mockReq = mockReqParam;
    mockRes = mockResParam;
    nextMock = nextMockParam;
    callback();
  })
};

exports.tearDown = function(callback) {
  mongoose.connection.db.dropDatabase(function() {
    callback();
  });
}

exports.testUsuarioSinViajesCreados = function(test) {
  routes.all(mockReq, {
    json: function(result) {
      test.equal(result.length, 0, 'El usuario tiene vieajes creados');
      test.done();
    }
  }, nextMock);
};

exports.testCrearNuevoViaje = function(test) {
  mockReq.body = {
    title: 'Europa',
    startDate: new Date(2015, 6, 1),
    endDate: new Date(2015, 6, 15)
  }
  routes.create(mockReq, {
    json: function(result) {
      test.equal(result.title, mockReq.body.title, 'El titulo del viaje creado no es el correcto');
      test.equal(result.startDate, mockReq.body.startDate, 'La fecha de omienzo del viaje creado no es la correcta');
      test.equal(result.endDate, mockReq.body.endDate, 'La fecha fin del viaje creado no es la correcta');
      test.done();
    }
  }, nextMock);
};