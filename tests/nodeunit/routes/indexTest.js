require('../../../app');
var routes = require('../../../routes/index');
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

exports.testLoginCorrecto = function(test) {
  mockReq.body = {
    username: 'jose',
    password: '123456'
  }
  routes.login(mockReq, {
    json: function(result) {
      test.ok(result.token, 'El token no fue generado');
      test.done();
    }
  }, nextMock);
};

exports.testLoginIncorrectoCamposObligatorios = function(test) {
  mockReq.body = {
    username: '',
    password: ''
  }
  routes.login(mockReq, {
    status: function(code) {
      return {
        json: function(result) {
          test.equal(code, 400, 'El estado al loguearse sin completar los campos no es 400');
          test.equal(result.message, 'Please fill out all fields', 'El mensaje de login invalido no es el esperado');
          test.done();
        }
      }
    }
  }, nextMock);
};

exports.testLoginIncorrectoUsuarioNoExiste = function(test) {
  mockReq.body = {
    username: 'fulano',
    password: '123456'
  }
  routes.login(mockReq, {
    status: function(code) {
      return {
        json: function(result) {
          test.equal(code, 401, 'El estado al loguearse sin completar los campos no es 401');
          test.equal(result.message, 'Incorrect username.', 'El mensaje de login invalido no es el esperado');
          test.done();
        }
      }
    }
  }, nextMock);
};

exports.testRegistroDeUsuarioCorrecto = function(test) {
  mockReq.body = {
    username: 'javier',
    password: '123456'
  }
  routes.register(mockReq, {
    json: function(result) {
      test.ok(result.token, 'El token no fue generado');
      test.done();
    }
  }, nextMock);
};