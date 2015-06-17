require('../../../app');
var routes = require('../../../routes/destinations');
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

exports.testCrearNuevoDestino = function(test) {
  mockReq.body = {
    title: 'Belgica',
    start: new Date(2015, 6, 4),
    end: new Date(2015, 6, 10)
  }
  mockReq.travel = info.travel;
  routes.create(mockReq, {
    json: function(result) {
      test.equal(result.title, mockReq.body.title, 'El titulo del destino creado no es el correcto');
      test.equal(result.start, mockReq.body.start, 'La fecha de omienzo del destino creado no es la correcta');
      test.equal(result.end, mockReq.body.end, 'La fecha fin del destino creado no es la correcta');
      test.done();
    }
  }, nextMock);
};

exports.testEliminarDestino = function(test) {
  mockReq.destination = info.destination;
  routes.remove(mockReq, {
    json: function(result) {
      test.ok(!result, 'El destino no fue eliminado correctamente');
      test.done();
    }
  }, nextMock);
};