// 'use strict';

// /* Controllers */
//   // signin controller
// app.controller('CourseList', ['$scope', '$http', '$state', '$cookieStore',function($scope, $http, $state, $cookieStore) {
//     $scope.alerts = [];
//     $scope.courses = {};
//     $scope.httpStatus = false;

//     $scope.addAlert = function(type,message) {
//       $scope.alerts.push({type: type, msg: message});
//     };
//     $scope.closeAlert = function(index) {
//       $scope.alerts.splice(index, 1);
//     };    
//      if ($cookieStore.get('globals') != undefined){
//         $scope.user_data = $cookieStore.get('globals').currentUser;
//         $http.defaults.headers.common['Authorization'] = 'Token ' + $scope.user_data.token;
//     }else{
//       $state.go('access.signin');
//     }
        
//     $http.get(baseUrl+'course/')
//       .success(function (response) {
//         $scope.courses= response;
//         $scope.httpStatus = true;

//       })
//       .error(function (data, status, headers){
//         $scope.addAlert('danger', 'Error loading course list');
//         $scope.httpStatus = true;
//       });

    
//     $scope.courseList = function(){
//       $http.get(baseUrl+'course')
//     }   


// }]);