app.controller('TravelCtrl', [
  '$scope',
  'travels',
  'travel',
  'auth',
  function($scope, travels, travel, auth) {
    $scope.travel = travel;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.destinationToRemove;
    $scope.map = {
      center: {
        latitude: 0,
        longitude: 0
      },
      zoom: 2
    };
    $scope.options = {
      scrollwheel: false
    };
    $scope.eventSources = [$scope.travel.destinations];
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: false,
        header: {
          left: '',
          center: 'title',
          right: 'prev,next'
        }
      }
    }

    $scope.pol = {
      id: 1,
      path: [],
      stroke: {
        color: '#6060FB',
        weight: 3
      },
      icons: [{
        icon: {
          path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
        },
        offset: '25px',
        repeat: '50px'
      }]
    };

    $scope.addDestination = function() {
      if (!$scope.body.name || !$scope.body.start || !$scope.body.end ||
        $scope.body.start > $scope.body.end ||
        $scope.travel.destinations.length > 0 &&
        $scope.body.start < $scope.travel.destinations[0].end) {
        return;
      }
      $scope.addMapPosition($scope.body);

      $scope.body.title = $scope.body.name;
      $scope.body.location = $scope.body.geometry.location;

      travels.addDestination(travel._id, $scope.body).success(function(destination) {
        $scope.travel.destinations.push(destination);
        $scope.body = null;
      });
    };

    $scope.addAllMapPosition = function(destinations) {
      for (i = 0; i < destinations.length; i++) {
        $scope.pol.path.unshift(new google.maps.LatLng(destinations[i].location.A, destinations[i].location.F));
      }
    };

    $scope.addMapPosition = function(destination) {
      $scope.pol.path.unshift(destination.geometry.location);
    };

    $scope.destinationOptions = {
      types: ['(cities)']
    };

    $scope.setDestinationToRemove = function(destination) {
      $scope.destinationToRemove = destination;
    }

    $scope.removeDestination = function() {
      travels.removeDestination(travel, $scope.destinationToRemove).success(function(data) {
        var index = travel.destinations.indexOf($scope.destinationToRemove);
        removePath(index);
        travel.destinations.splice(index, 1);
      });
    };

    function removePath(index) {
      for (i = 0; i < $scope.pol.path.length; i++) {
        if (equalsLocations($scope.pol.path[i], $scope.travel.destinations[index].location)) {
          $scope.pol.path.splice(i, 1);
        }
      }
    }

    function equalsLocations(locationA, locationB) {
      return locationA.A == locationB.A && locationA.B == locationB.B;
    }

    $scope.addAllMapPosition(travel.destinations);
  }
]);