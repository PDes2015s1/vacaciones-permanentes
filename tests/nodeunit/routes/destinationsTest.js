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
    json: function(destination) {
      test.equal(destination.title, mockReq.body.title, 'El titulo del destino creado no es el correcto');
      test.equal(destination.start, mockReq.body.start, 'La fecha de omienzo del destino creado no es la correcta');
      test.equal(destination.end, mockReq.body.end, 'La fecha fin del destino creado no es la correcta');
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

exports.testCrearYAgregarNuevoPuntoDeInteres = function(test) {
  mockReq.body = {
    title: 'Argentina',
    formatted_address: 'Buenos Aires',
    formatted_phone_number: '12345678',
    rating: 2
  }
  mockReq.destination = info.destination;
  routes.createPoint(mockReq, {
    json: function(point) {
      test.equal(point.title, mockReq.body.title, 'El titulo del destino creado no es el correcto');
      test.equal(point.formatted_address, mockReq.body.formatted_address, 'La direccion no es la correcta');
      test.equal(point.formatted_phone_number, mockReq.body.formatted_phone_number, 'El telefono fin no es en correcto');
      test.done();
    }
  }, nextMock);
};

exports.testDestinoSinPuntosDeInteres = function(test) {
  mockReq.destination = info.destination;
  routes.get(mockReq, {
    json: function(destination) {
      test.equal(destination.pointsOfInterest.length, 0, 'El destino no debe tener puntos de intereses creados');
      test.done();
    }
  }, nextMock);
};

exports.testCrearYAgregarNuevoHospedaje = function(test) {
  mockReq.body = {
    title: 'Buenos Aires',
    formatted_address: 'Buenos Aires',
    formatted_phone_number: '12345678',
    rating: 4
  }
  mockReq.destination = info.destination;
  routes.createLodging(mockReq, {
    json: function(lodging) {
      test.equal(lodging.title, mockReq.body.title, 'El titulo del destino creado no es el correcto');
      test.equal(lodging.formatted_address, mockReq.body.formatted_address, 'La direccion no es la correcta');
      test.equal(lodging.formatted_phone_number, mockReq.body.formatted_phone_number, 'El telefono fin no es en correcto');
      test.done();
    }
  }, nextMock);
};