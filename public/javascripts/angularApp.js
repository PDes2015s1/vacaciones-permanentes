var app = angular.module('vacaciones-permanentes', ['ui.router', 'angularMoment']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('travels', {
        url: '/travels',
        templateUrl: '/travels.html',
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
        templateUrl: '/travel.html',
        controller: 'TravelCtrl',
        resolve: {
          travel: ['$stateParams', 'travels', function($stateParams, travels) {
            return travels.get($stateParams.id);
          }]
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('travels');
          }
        }]
      }).state('home', {
        url: '/home',
        templateUrl: '/home.html',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('travels');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('travels');
          }
        }]
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

app.factory('travels', ['$http', 'auth', function($http, auth) {
  var headers = { headers: {Authorization: 'Bearer ' + auth.getToken()} };
  var o = {
    travels: [],
    getAll: function() {
      return $http.get('/travels', headers).success(function(data) {
        angular.copy(data, o.travels);
      })
    },
    create: function(travel) {
      return $http.post('/travels', travel, headers).success(function(data) {
        o.travels.push(data);
      });
    },
    remove: function(travel) {
      return $http.delete('/travels/' + travel._id, headers).success(function(data) {
        for (i = 0; i < o.travels.length; i++) {
          if (o.travels[i]._id == travel._id)
            o.travels.splice(i, 1);
        }
      });
    },
    get: function(id) {
      return $http.get('/travels/' + id, headers).then(function(res) {
        return res.data;
      });
    },
    addDestination: function(id, destination) {
      return $http.post('/travels/' + id + '/destinations', destination, headers);
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
    $scope.addDestination = function() {
      if ($scope.body === '') {
        return;
      }
      travels.addDestination(travel._id, {
        body: $scope.body
      }).success(function(destination) {
        $scope.travel.destinations.push(destination);
      });
      $scope.body = '';
    };
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
