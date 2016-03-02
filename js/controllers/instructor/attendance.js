'use strict';
app.controller('Attendance', ['$scope', '$http', '$state', '$cookieStore','$filter',function($scope, $http, $state, $cookieStore, $filter) {
    $scope.alerts = [];
    $scope.courses = {};
    $scope.httpStatus1 = false;
    $scope.httpStatus2 = true;
    $scope.found = false;
    $scope.found2 = false;    
    $scope.new_student="";

    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };    
     if ($cookieStore.get('globals') != undefined){
        $scope.user_data = $cookieStore.get('globals').currentUser;
        $http.defaults.headers.common['Authorization'] = 'Token ' + $scope.user_data.token;
        // console.log($http.defaults.headers.common['Authorization'])
    }else{
      $state.go('access.signin');
    }
        
    $http.get(baseUrl+'course/')
      .success(function (response) {
        for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i);
          };
        $scope.courses= response;
        $scope.httpStatus1 = true;
        if ($scope.courses.length == 0){
          $scope.addAlert('warning','No registered courses found!');
          return;
        }
        $scope.found = true;
      })
      .error(function (data, status, headers){
        $scope.addAlert('danger', 'Error loading course list');
        $scope.httpStatus1 = true;
      });

    $scope.loadList = function(code){
      $scope.httpStatus2 = false;
      //code not done
      if (code != undefined){
         $http.get(baseUrl+'attendance/attendance_list/'+code+'/')
          .success(function (response) {
            for (var i = $scope.alerts.length - 1; i >= 0; i--) {
              $scope.closeAlert(i);
            };
            $scope.students= response;
             if ($scope.students.length == 0){
              $scope.addAlert('warning','No student data found for this class!');
              $scope.found2 = false;
              $scope.httpStatus2 = true;  
              return;
            }
            $scope.exportData = [];

            var newd = $filter('date')($scope.students[0]['timestamp'], 'mediumTime')
            for (var student in $scope.students) {
              $scope.exportData.push({matric_no: $scope.students[student]['matric_no'], 
                                              date: $filter('date')($scope.students[student]['timestamp'] *1000, 'mediumDate'),
                                              time: $filter('date')($scope.students[student]['timestamp'] *1000, 'mediumTime')})
            }
            $scope.count = $scope.students.length
            $scope.httpStatus2 = true;           
            $scope.found2 = true;
          })
          .error(function (data, status, headers){
            for (var i = $scope.alerts.length - 1; i >= 0; i--) {
              $scope.closeAlert(i);
            };
            $scope.addAlert('danger', 'Error loading attendance list');
            $scope.httpStatus1 = true;
          });
      }    
    }
    $scope.getHeader = function () {return ['Matric Number', 'Date', 'Time']};

     


}]);