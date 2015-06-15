app.factory('travels', ['$http', 'auth', function($http, auth) {
  var headers = function() {
    return {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    };
  };
  var o = {
    travels: [],
    getAll: function() {
      return $http.get('/travels', headers()).success(function(data) {
        angular.copy(data, o.travels);
      });
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