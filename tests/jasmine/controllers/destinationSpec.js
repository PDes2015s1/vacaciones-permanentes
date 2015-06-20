'use strict';

describe("DestinationCtrl", function() {

  var scope, controller, httpBackend, mockDestination;
  var mockGoogleMap = {
    getGMap: function() {
      return {
        fitBounds: function(bounds) {}
      }
    }
  };

  var mockPoint = {
    _id: 1,
    name: 'Punto de interes',
    geometry: {
      location: {
        A: 1,
        F: 1
      }
    }
  };

  beforeEach(function() {
    module('vacaciones-permanentes');
  });

  beforeEach(inject(function($controller, $rootScope, $injector) {
    httpBackend = $injector.get('$httpBackend');

    mockDestination = {
      _id: 1,
      title: 'Destination',
      user: 1,
      pointsOfInterest: []
    };

    scope = $rootScope.$new();
    controller = $controller('destinationCtrl', {
      destination: mockDestination,
      $scope: scope
    });
  }));

  it("Establece un punto de interes para eliminar", function() {
    scope.setPointToRemove(mockPoint);
    expect(scope.pointToRemove).toEqual(mockPoint);
  });

  it("Mostrar puntos de interes", function() {
    scope.showPointOfInterest(mockPoint);
    expect(scope.pointOfInterestToShow).toEqual(mockPoint);
  });

  it("Tipos de los puntos de interes establecimiento", function() {
    expect(scope.pointOptions.types[0]).toEqual('establishment');
  });

  it("Agregando punto de interes correctamente", function() {
    addMockPoint();
    expect(scope.destination.pointsOfInterest.length).toEqual(1);
    expect(scope.destination.pointsOfInterest[0]).toEqual(mockPoint);
  });

  it("El nombre de punto de interes es obligatorio para crearlo", function() {
    scope.map.googleMap = mockGoogleMap;
    scope.pointOfInterest = {};
    scope.addPointOfInterest();
    expect(scope.destination.pointsOfInterest.length).toEqual(0);
  });

  it("Eliminando punto de interes correctamente", function() {
    addMockPoint();

    httpBackend.expectDELETE('/destinations/' + mockDestination._id + '/' + mockPoint._id + '/')
      .respond(mockPoint);
    scope.pointToRemove = mockPoint;
    scope.removePoint();
    httpBackend.flush();

    expect(scope.destination.pointsOfInterest.length).toEqual(0);
  });

  function addMockPoint() {
    scope.map.googleMap = mockGoogleMap;
    httpBackend.expectPOST('/destinations/' + mockDestination._id + '/pointsOfInterest', mockPoint)
      .respond(mockPoint);
    scope.pointOfInterest = mockPoint;
    scope.addPointOfInterest();
    httpBackend.flush();
  }

});