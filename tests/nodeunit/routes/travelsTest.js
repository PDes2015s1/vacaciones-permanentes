require('../../../app');
var routes = require('../../../routes/travels');
var data = require('../../../extras/initDataTest');
var mongoose = require('mongoose');

var mockReq;
var mockRes;
var nextMock;
var info;

exports.setUp = function(callback) {
  data(function(mockReqParam, mockResParam, nextMockParam, infoParam) {
    mockReq = mockReqParam;
    mockRes = mockResParam;
    nextMock = nextMockParam;
    info = infoParam;
    callback();
  })
};

exports.tearDown = function(callback) {
  mongoose.connection.db.dropDatabase(function() {
    callback();
  });
}

exports.testCrearNuevoViaje = function(test) {
  mockReq.body = {
    title: 'Europa',
    startDate: new Date(2015, 6, 1),
    endDate: new Date(2015, 6, 15)
  }
  routes.create(mockReq, {
    json: function(travel) {
      test.equal(travel.title, mockReq.body.title, 'El titulo del viaje creado no es el correcto');
      test.equal(travel.startDate, mockReq.body.startDate, 'La fecha de omienzo del viaje creado no es la correcta');
      test.equal(travel.endDate, mockReq.body.endDate, 'La fecha fin del viaje creado no es la correcta');
      test.done();
    }
  }, nextMock);
};

exports.testEliminarViaje = function(test) {
  mockReq.travel = info.travel;
  routes.remove(mockReq, {
    json: function(result) {
      test.ok(!result, 'El viaje no fue eliminado correctamente');
      test.done();
    }
  }, nextMock);
};

exports.testUsuarioConUnViajeCreado = function(test) {
  routes.all(mockReq, {
    json: function(result) {
      test.equal(result.length, 1, 'El usuario debe tener un viaje creado');
      test.done();
    }
  }, nextMock);
};