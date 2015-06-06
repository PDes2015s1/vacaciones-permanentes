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