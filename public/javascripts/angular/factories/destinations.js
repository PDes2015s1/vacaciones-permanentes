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