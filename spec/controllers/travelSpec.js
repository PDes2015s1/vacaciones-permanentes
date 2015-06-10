'use strict';

describe("TravelCtrl", function() {

  var scope, controller, httpBackend, mockTravel;
  var mockDestination = {
    _id: 1,
    name: 'Destination',
    user: 1,
    start: new Date(2015, 5, 2),
    end: new Date(2015, 5, 5),
    pointsOfInterest: [],
    geometry: {
      location: {
        A: 1,
        F: 1
      }
    }
  };

  beforeEach(function() {
    module('vacaciones-permanentes')
  });

  beforeEach(inject(function($controller, $rootScope, $injector) {
    httpBackend = $injector.get('$httpBackend');

    mockTravel = {
      _id: 1,
      title: 'Travel',
      user: 1,
      start: new Date(2015, 5, 1),
      end: new Date(2015, 5, 10),
      destinations: []
    };

    scope = $rootScope.$new();
    controller = $controller('TravelCtrl', {
      travel: mockTravel,
      $scope: scope
    });
  }));

  it("Agregando un destino correctamente", function() {
    addMockDestination();
    expect(scope.travel.destinations.length).toEqual(1);
    expect(scope.travel.destinations[0]).toEqual(mockDestination);
  });

  it("Todos los campos del destino son obligatorios para crearlo", function() {
    scope.body = {};
    scope.addDestination();
    expect(scope.travel.destinations.length).toEqual(0);
  });

  function addMockDestination() {
    httpBackend.expectPOST('/travels/' + mockTravel._id + '/destinations', mockDestination)
      .respond(mockDestination);
    scope.body = mockDestination;
    scope.addDestination();
    httpBackend.flush();
  }

});