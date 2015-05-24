var app = angular.module('vacaciones-permanentes', ['ui.router', 'angularMoment',
  'google.places', 'uiGmapgoogle-maps', 'ui.calendar'
]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('travels', {
        url: '/travels',
        templateUrl: '/view/travels/all',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['travels', function(travels) {
            return travels.getAll();
          }]
        }
      });
    $stateProvider
      .state('travel', {
        url: '/travel/{id}',
        templateUrl: '/view/travels/detail',
        controller: 'TravelCtrl',
        resolve: {
          travel: ['$stateParams', 'travels', function($stateParams, travels) {
            return travels.get($stateParams.id);
          }]
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: '/view/login',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('travels');
          }
        }]
      }).state('home', {
        url: '/home',
        templateUrl: '/view/home',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('travels');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/view/register',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('travels');
          }
        }]
      })
      .state('destination', {
        url: '/destination/{id}',
        templateUrl: '/view/destinations/detail',
        controller: 'destinationCtrl',
        resolve: {
          destination: ['$stateParams', 'destinations', function($stateParams, destinations) {
            return destinations.get($stateParams.id);
          }]
        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);


app.factory('auth', ['$http', '$window', function($http, $window) {
  var auth = {};

  auth.saveToken = function(token) {
    $window.localStorage['flapper-news-token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['flapper-news-token'];
  }

  auth.isLoggedIn = function() {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user) {
    return $http.post('/register', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user) {
    return $http.post('/login', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function() {
    $window.localStorage.removeItem('flapper-news-token');
  };

  return auth;
}])

app.factory('destinations', ['$http', 'auth', function($http, auth) {
  var headers = function() {
    return {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }
  };
  var o = {
    get: function(id) {
      return $http.get('/destinations/' + id, headers()).then(function(res) {
        return res.data;
      });
    },
    addPointOfInterest: function(idDestintation, pointOfInterest) {
      return $http.post('/destinations/' + idDestintation + '/pointsOfInterest', pointOfInterest, headers());
    },
    removePoint: function(destination, point) {
      return $http.delete('/destinations/' + destination._id + '/' + point._id + '/',
        headers());
    },
    addLodging: function(idDestintation, lodging) {
      return $http.post('/destinations/' + idDestintation + '/lodging', lodging, headers());
    }
  }
  return o;
}]);

app.factory('travels', ['$http', 'auth', function($http, auth) {
  var headers = function() {
    return {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }
  };
  var o = {
    travels: [],
    getAll: function() {
      return $http.get('/travels', headers()).success(function(data) {
        angular.copy(data, o.travels);
      })
    },
    create: function(travel) {
      return $http.post('/travels', travel, headers()).success(function(data) {
        o.travels.push(data);
      });
    },
    remove: function(travel) {
      return $http.delete('/travels/' + travel._id, headers()).success(function(data) {
        for (i = 0; i < o.travels.length; i++) {
          if (o.travels[i]._id == travel._id)
            o.travels.splice(i, 1);
        }
      });
    },
    removeDestination: function(travel, destination) {
      return $http.delete('/travels/' + travel._id + '/' + destination._id + '/dest',
        headers());
    },
    get: function(id) {
      return $http.get('/travels/' + id, headers()).then(function(res) {
        return res.data;
      });
    },
    addDestination: function(id, destination) {
      return $http.post('/travels/' + id + '/destinations', destination, headers());
    }
  };
  return o;
}]);

app.controller('MainCtrl', [
  '$scope', 'travels', 'auth', '$filter',
  function($scope, travels, auth, $filter) {
    var orderBy = $filter('orderBy');
    $scope.reverse = true;
    $scope.travels = travels.travels;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.travelToRemove;

    $scope.setTravelToRemove = function(travel) {
      $scope.travelToRemove = travel;
    }

    $scope.addTravel = function() {
      if ($scope.isInvalidTravel()) {
        return;
      }
      travels.create({
        title: $scope.title,
        startDate: $scope.startDate,
        endDate: $scope.endDate
      });
      $scope.title = '';
      $scope.link = '';
    };

    var noValueIn = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!$scope[arguments[i]] || $scope[arguments[i]] === '') return true;
      }
      return false;
    }

    $scope.isInvalidTravel = function() {
      return noValueIn('title', 'startDate', 'endDate') || $scope.startDate > $scope.endDate;
    }

    $scope.removeTravel = function() {
      travels.remove($scope.travelToRemove);
    };

    $scope.order = function(predicate) {
      $scope.reverse = !$scope.reverse;
      $scope.predicate = predicate;
    };
  }
]);

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
	  
	  //alert(JSON.stringify($scope.pointOfInterest.formatted_address))
	  //alert(JSON.stringify($scope.pointOfInterest.formatted_phone_number))
	  //alert(JSON.stringify($scope.pointOfInterest))
	  
	  myLocation = $scope.pointOfInterest.geometry.location;
      $scope.pointOfInterest.title = $scope.pointOfInterest.name;
      $scope.pointOfInterest.location = {latitude:myLocation.A,longitude:myLocation.F};
      destinations.addPointOfInterest(destination._id, $scope.pointOfInterest).success(function(pointOfInterest) {
  
        //centrando mapa
        var latlng = new google.maps.LatLng(myLocation.A, myLocation.F);
        bounds.extend(latlng);
        $scope.map.googleMap.getGMap().fitBounds(bounds);
	  
        $scope.destination.pointsOfInterest.push(pointOfInterest);
        $scope.pointOfInterest = null;
      });
    }
	
    $scope.setPointToRemove = function(point) {
      $scope.pointToRemove = point;
    }
	
    $scope.removePoint = function() {
      destinations.removePoint(destination, $scope.pointToRemove).success(function(data) {
        var index = destination.pointsOfInterest.indexOf($scope.pointToRemove);
        destination.pointsOfInterest.splice(index, 1);
      });
    };
	
	$scope.centerMap=function(){
	  for(n=0;n < destination.pointsOfInterest.length;n++){
		var latlng = new google.maps.LatLng(destination.pointsOfInterest[n].location.latitude, destination.pointsOfInterest[n].longitude);
        bounds.extend(latlng);
        $scope.map.googleMap.getGMap().fitBounds(bounds);
	  }
	}

	$scope.showPointOfInterest=function(point){
		$scope.pointOfInterestToShow=point;
	}
	$scope.addLodging=function(){
      myLocation = $scope.lodging.geometry.location;
      $scope.lodging.title = $scope.lodging.name;
      $scope.lodging.location = {latitude:myLocation.A,longitude:myLocation.F};
	  destinations.addLodging(destination._id, $scope.lodging).success(function(lodging) {
        $scope.destination.lodging=lodging;
        var latlng = new google.maps.LatLng(myLocation.A, myLocation.F);
        bounds.extend(latlng);
        $scope.map.googleMap.getGMap().fitBounds(bounds);
	  });
	}
	$scope.removeLodging=function(){
	  destinations.removePoint(destination, $scope.destination.lodging).success(function(data) {
        $scope.destination.lodging=null;
      });
	}
  }
]);

app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth) {
    $scope.user = {};

    $scope.register = function() {
      auth.register($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('travels');
      });
    };

    $scope.logIn = function() {
      auth.logIn($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('travels');
      });
    };
  }
])

.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }
]);