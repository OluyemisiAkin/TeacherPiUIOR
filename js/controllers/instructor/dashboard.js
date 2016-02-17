'use strict';

/* Controllers */
  // signin controller
app.controller('Dashboard', ['$scope', '$http', '$state', '$cookieStore',function($scope, $http, $state, $cookieStore) {
    $scope.alerts = [];

    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    if ($cookieStore.get('globals') != undefined){
        $scope.user_data = $cookieStore.get('globals').currentUser;
        $http.defaults.headers.common['Authorization'] = 'Token ' + $scope.user_data.token;
        // console.log($scope.user_data)
    }else{
      $state.go('access.signin');
    }
       

  }]);