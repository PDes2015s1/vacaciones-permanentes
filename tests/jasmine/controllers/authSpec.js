'use strict';

describe("AuthCtrl", function() {

  var scope, controller, httpBackend;
  var mockUser = {
    username: 'javier',
    password: '1234'
  };

  beforeEach(function() {
    module('vacaciones-permanentes');
  });

  beforeEach(inject(function($controller, $rootScope, $injector) {
    httpBackend = $injector.get('$httpBackend');

    httpBackend.when('GET', '/view/home')
      .respond({});
    httpBackend.when('GET', '/travels')
      .respond({});
    httpBackend.when('GET', '/view/travels/all')
      .respond({});

    scope = $rootScope.$new();
    controller = $controller('AuthCtrl', {
      $scope: scope
    });
  }));

  it("Sin usuario al iniciar el sistema", function() {
    expect(scope.user).toEqual({});
  });

  it("Campos de registros obligatorios", function() {
    var msg = 'Todos los campos son obligatorios';
    httpBackend.expectPOST('/register', {})
      .respond(401, msg);
    scope.register();
    httpBackend.flush();
    expect(scope.error).toBe(msg);
  });

  it("Login usuario incorrecto", function() {
    var msg = "El usuario es incorrecto";
    httpBackend.expectPOST('/login', mockUser)
      .respond(401, msg);
    scope.user = mockUser;
    scope.logIn();
    httpBackend.flush();
    expect(scope.error).toBe(msg);
  });

  it("Usuario registrado correctamente", function() {
    var msg;
    httpBackend.expectPOST('/register', mockUser)
      .respond({
        toke: 'XXXX'
      });
    scope.user = mockUser;
    scope.register();
    httpBackend.flush();
    expect(scope.error).toBe(msg);
  });

  it("Login correcto", function() {
    var msg;
    httpBackend.expectPOST('/login', mockUser)
      .respond({
        toke: 'XXXX'
      });
    scope.user = mockUser;
    scope.logIn();
    httpBackend.flush();
    expect(scope.error).toBe(msg);
  });
});