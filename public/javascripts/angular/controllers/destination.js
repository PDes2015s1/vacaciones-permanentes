app.controller('destinationCtrl', [
  '$scope',
  'destinations',
  'destination',
  'auth',
  function($scope, destinations, destination, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.destination = destination;
    $scope.pointOptions = {
      types: ['establishment']
    };
    $scope.map = {
      googleMap: {},
      center: {
        latitude: 0,
        longitude: 0
      },
      zoom: 2
    };
    $scope.options = {
      scrollwheel: true
    };

    $scope.markers = [];
    //Para centrar el mapa correctamente
    var bounds = new google.maps.LatLngBounds();

    $scope.addPointOfInterest = function() {
      if (!$scope.pointOfInterest || !$scope.pointOfInterest.name) return;

      myLocation = $scope.pointOfInterest.geometry.location;
      $scope.pointOfInterest.title = $scope.pointOfInterest.name;
      $scope.pointOfInterest.location = {
        latitude: myLocation.A,
        longitude: myLocation.F
      };
      destinations.addPointOfInterest(destination._id, $scope.pointOfInterest).success(function(pointOfInterest) {

        //centrando mapa
        var latlng = new google.maps.LatLng(myLocation.A, myLocation.F);
        bounds.extend(latlng);
        $scope.map.googleMap.getGMap().fitBounds(bounds);

        $scope.destination.pointsOfInterest.push(pointOfInterest);
        $scope.pointOfInterest = null;
      });
    };

    $scope.setPointToRemove = function(point) {
      $scope.pointToRemove = point;
    };

    $scope.removePoint = function() {
      destinations.removePoint(destination, $scope.pointToRemove).success(function(data) {
        var index = destination.pointsOfInterest.indexOf($scope.pointToRemove);
        destination.pointsOfInterest.splice(index, 1);
      });
    };

    $scope.centerMap = function() {
      for (n = 0; n < destination.pointsOfInterest.length; n++) {
        var latlng = new google.maps.LatLng(destination.pointsOfInterest[n].location.latitude, destination.pointsOfInterest[n].longitude);
        bounds.extend(latlng);
        $scope.map.googleMap.getGMap().fitBounds(bounds);
      }
    };

    $scope.showPointOfInterest = function(point) {
      $scope.pointOfInterestToShow = point;
    };

    $scope.addLodging = function() {
      if (!$scope.lodging || !$scope.lodging.name) return;

      if (!isLodging()) {
        alert("Hospedaje inválido");
        $scope.lodging = null;
        return;
      }

      myLocation = $scope.lodging.geometry.location;
      $scope.lodging.title = $scope.lodging.name;
      $scope.lodging.location = {
        latitude: myLocation.A,
        longitude: myLocation.F
      };

      destinations.addLodging(destination._id, $scope.lodging).success(function(lodging) {
        $scope.destination.lodging = lodging;
        var latlng = new google.maps.LatLng(myLocation.A, myLocation.F);
        bounds.extend(latlng);
        $scope.map.googleMap.getGMap().fitBounds(bounds);
      });
    };

    $scope.removeLodging = function() {
      destinations.removePoint(destination, $scope.destination.lodging).success(function(data) {
        $scope.destination.lodging = null;
        $scope.lodging = null;
      });
    };

    function isLodging() {
      return $scope.lodging.types.indexOf("lodging") != -1;
    }
  }
]);