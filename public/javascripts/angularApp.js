var app = angular.module('flapperNews', ['ui.router', 'angularMoment']);

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
  var o = {
    travels: [],
    getAll: function() {
      return $http.get('/travels', {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        angular.copy(data, o.travels);
      })
    },
    create: function(travel) {
      return $http.post('/travels', travel, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        o.travels.push(data);
      });
    },
    upvote: function(travel) {
      return $http.put('/travels/' + travel._id + '/upvote', null, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        travel.upvotes += 1;
      });
    },
    get: function(id) {
      return $http.get('/travels/' + id).then(function(res) {
        return res.data;
      });
    },
    addComment: function(id, comment) {
      return $http.post('/travels/' + id + '/comments', comment, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      });
    },
    upvoteComment: function(travel, comment) {
      return $http.put('/travels/' + travel._id + '/comments/' + comment._id + '/upvote', null, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        comment.upvotes += 1;
      });
    }
  };
  return o;
}]);

app.controller('MainCtrl', [
  '$scope', 'travels', 'auth', '$filter',
  function($scope, travels, auth, $filter) {
    $scope.test = 'Hello world!';
    var orderBy = $filter('orderBy');
    $scope.reverse = true;
    $scope.travels = travels.travels;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.addTravel = function() {
      if (!$scope.title || $scope.title === '') {
        return;
      }
      travels.create({
        title: $scope.title,
        link: $scope.link,
        startDate: $scope.startDate,
        endDate: $scope.endDate
      });
      $scope.title = '';
      $scope.link = '';
    };

    $scope.order = function(predicate) {
      $scope.reverse = !$scope.reverse;
      $scope.predicate = predicate;
    };
    $scope.order('title');

    $scope.incrementUpvotes = function(travel) {
      travels.upvote(travel);
    };

  }
]);

app.controller('TravelCtrl', [
  '$scope',
  'travels',
  'travel',
  'auth',
  function($scope, travels, travel, auth) {
    $scope.travels = travel;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.addComment = function() {
      if ($scope.body === '') {
        return;
      }
      travels.addComment(travel._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.travel.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
      travels.upvoteComment(travel, comment);
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