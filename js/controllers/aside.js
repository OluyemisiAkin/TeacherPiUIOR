'use strict';
// signup controller
app.controller('UserData', ['$scope', '$cookieStore', function($scope, $cookieStore) {
    $scope.user = {};
    $scope.alerts = [];

    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    if ($cookieStore.get('globals') != undefined){
      $scope.user_data = $cookieStore.get('globals').currentUser;        
      }
      else{
        // console.log('i would have logged o but no show')
      }  

}]);