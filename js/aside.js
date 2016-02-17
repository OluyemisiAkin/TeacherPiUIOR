'use strict';
console.log('file')
// signup controller
app.controller('UserData', ['$scope', '$cookieStore', function($scope, $cookieStore) {
  console.log('loaded')
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
        // console.log('got here')
        // var data = function (){
        //   console.log('in function')
        //   $scope.user_data = $cookieStore.get('globals').currentUser;
        // }
        // console.log('outside function')
        // $timeout(data,2000)
      }
      else{
        console.log('i would have logged o but no show')
      }  

}]);