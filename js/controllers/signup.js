'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.alerts = [];

    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.signUp = function() {
      $scope.loading = true;     
      $http.post(baseUrl+'student/register/', $scope.user).then(
        function (success_response){
          if (success_response.statusText == 'CREATED') {
            $scope.loading = false;      
            $state.go('access.signin');
          }
        },
        function (error_response){
          for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i)
          };
          if (error_response.status == 500){
            $scope.loading = false;                  
            $scope.addAlert('danger','Server Error');
          }else if (error_response.status == 400) {
            $scope.loading = false;                  
            for (var key in error_response.data){
              for (var item in error_response.data[key]){
                $scope.addAlert('danger',error_response.data[key][item]);
              }
            }
          }else{
            $scope.loading = false;                  
            $scope.addAlert('danger','Ooops! something went wrong. Please retry');
          };        
        });
    };
}]);