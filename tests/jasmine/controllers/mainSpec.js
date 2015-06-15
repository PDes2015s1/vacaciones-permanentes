'use strict';

describe("MainCtrl", function() {

  var scope, controller, httpBackend;
  var mockTravel = {
    title: 'Travel',
    startDate: new Date(2015, 5, 1),
    endDate: new Date(2015, 5, 10),
  };

  beforeEach(function() {
    module('vacaciones-permanentes');
  });

  beforeEach(inject(function($controller, $rootScope, $injector) {
    httpBackend = $injector.get('$httpBackend');

    scope = $rootScope.$new();
    controller = $controller('MainCtrl', {
      travel: mockTravel,
      $scope: scope
    });
  }));

  it("Establece un viaje para eliminar", function() {
    scope.setTravelToRemove(mockTravel);
    expect(scope.travelToRemove).toEqual(mockTravel);
  });

  it("Agregando un viaje correctamente", function() {
    addMockTravel();
    expect(scope.travels.length).toEqual(1);
    expect(scope.travels[0]).toEqual(mockTravel);
  });

  it("Todos los campos del viaje son obligatorios", function() {
    scope.addTravel();
    expect(scope.travels.length).toEqual(0);
  });

  it("Eliminando un viaje correctamente", function() {
    addMockTravel();
    httpBackend.expectDELETE('/travels/' + mockTravel._id)
      .respond(mockTravel);
    scope.setTravelToRemove(mockTravel);
    scope.removeTravel();
    httpBackend.flush();
    expect(scope.travels.length).toEqual(0);
  });

  function addMockTravel() {
    httpBackend.expectPOST('/travels', mockTravel)
      .respond(mockTravel);
    scope.title = mockTravel.title;
    scope.startDate = mockTravel.startDate;
    scope.endDate = mockTravel.endDate;
    scope.addTravel();
    httpBackend.flush();
  }

});