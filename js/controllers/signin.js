'use strict';

// /* Controllers */

/* Controllers */
  // signin controller
app.controller('Signin', ['$scope', '$http', '$state', 'AuthenticationService','$stateParams','otherServices',
 function ($scope, $http, $state, AuthenticationService, $stateParams,otherServices) {
    $scope.user = {};
    $scope.authError = null;

    $scope.alerts = [];

    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    if($stateParams.logout){
      AuthenticationService.Logout();
    }
    if($stateParams.msg){
      $scope.addAlert('warning', $stateParams.msg);
    }
    
    

    (function initController () {
      AuthenticationService.ClearCredentials();
    })();

    var rightNow = new Date()
    $http.get(baseUrl+'user/house_keeping/'+rightNow+'/')
      .success(function (response){
      })
      .error(function (response){
      })   
    
    $scope.login = function(user_type){
      $scope.loading = true;
      AuthenticationService.Login($scope.user['identity'], user_type, $scope.user['password'],
        function(success_response){  
          $scope.loading = false;
          var token = success_response.token;
          AuthenticationService.SetCredentials($scope.user['identity'], user_type, token);          
          
          if (user_type =='staff'){
            $state.go('app2.instructor.dashboard');
          }else{          
            $state.go('app.student.dashboard');
          }
        },
        function(error_response){   
          // console.log(error_response)       
          $scope.loading = false;
          for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i)
          };
          console.log(error_response)
          if (error_response['non_field_errors']){
              $scope.addAlert('danger',error_response['non_field_errors'][0]);
          }
          else if (error_response['identity']){
              $scope.addAlert('danger',error_response['identity'][0]);
          }
          else if (error_response['detail']){
              $scope.addAlert('danger',error_response['detail']);     
          }
          else{
            $scope.addAlert('danger', 'Server Error');
          }

        }
        );

    };



  }]);