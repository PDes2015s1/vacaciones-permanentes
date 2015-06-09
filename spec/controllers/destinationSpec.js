'use strict';

describe("DestinationCtrl", function() {

  var scope, controller, httpBackend;
  var mockDestination = {
    title: 'Destination',
    user: 1
  };

  beforeEach(function() {
    module('vacaciones-permanentes')
  });

  beforeEach(inject(function($controller, $rootScope, $injector) {
    httpBackend = $injector.get('$httpBackend');

    scope = $rootScope.$new();
    controller = $controller('destinationCtrl', {
      destination: mockDestination,
      $scope: scope
    });
  }));

  it("Establece in punto de interes para eliminar", function() {
    var mockPoint = {
      title: 'Punto a eliminar'
    };
    scope.setPointToRemove(mockPoint);
    expect(scope.pointToRemove).toEqual(mockPoint);
  });

});