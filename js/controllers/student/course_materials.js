'use strict';
app.controller('CourseMaterialCtrl', ['$scope', '$http', '$state', '$cookieStore','$window',function($scope, $http, $state, $cookieStore, $window) {
    $scope.alerts = [];
    $scope.courses = {};
    $scope.httpStatus1 = false;
    $scope.httpStatus2 = true;
    $scope.found2 = false;    
    var course_code = ""

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
    (function () {
      $http.get(baseUrl+'attendance/activeclass/').then(
        function (success_response){
          $scope.httpStatus1 = true;
          if (success_response.data != 'There is no active course!'){
            $scope.activeClass = true;
            $scope.course = success_response.data[0];
            course_code =$scope.course.course_code;
            $scope.loadList(course_code); 
          }else {
            $scope.addAlert('warning', 'No currently active class!');
          }
        },
        function (data, status, headers){
         if (status == 401){
          $state.go('access.signin',{logout:true, msg:'Session timed out or class already ended!'});
          }
          else{
            $scope.httpStatus = true;
            $scope.addAlert('danger', 'Server Error');
          }
        });           
    })();
   
    $scope.loadList = function(code){
      //code not done
      if (code != undefined){
         $http.get(baseUrl+'file/list/'+code+'/')
          .success(function (response) {
            for (var i = $scope.alerts.length - 1; i >= 0; i--) {
              $scope.closeAlert(i);
            };
            $scope.files= response;
             if ($scope.files.length == 0){
              $scope.addAlert('warning','No uploaded files found for this course!');
              $scope.found2 = false;
              $scope.httpStatus1 = true;  
              return;
            } 

            for (var file in $scope.files) {
              $scope.file_item = $scope.files[file]  
            }
            $scope.count = $scope.files.length
            $scope.httpStatus1 = true;           
            $scope.found2 = true;
          })
          .error(function (data, status, headers){
            for (var i = $scope.alerts.length - 1; i >= 0; i--) {
              $scope.closeAlert(i);
            };
            if (status == 401){
                $state.go('access.signin',{logout:true, msg:'Session timed out or you ended the class!'});
            }
            else{
              $scope.addAlert('danger', 'Error loading file list');
              $scope.httpStatus1 = true;
            }
          });
      }    
    }   
  
    $scope.viewFile = function(file_name){
      file_name = file_name.split(".")[0]+'.html'
      // $scope.loading2 = true;
      window.open(baseUrl+'media/'+course_code+'/'+file_name+'/')
      
    }

    // $scope.getQuiz = function(){
    //       $scope.loading2 = true;
    //        $http.get(baseUrl+'quiz/take_quiz/EEE101/State Machine/2/')
    //         .success(function (response) {
    //           console.log(response)
              
    //         })
    //         .error(function (data, status, headers){
    //           console.log(data)
               
    //         });
    // }
     
    // $scope.getQuiz()

}]);