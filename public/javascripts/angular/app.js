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