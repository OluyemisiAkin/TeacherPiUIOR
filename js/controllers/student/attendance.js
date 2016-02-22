'use strict';

/* Controllers */
  // signin controller
app.controller('studentAttendance', ['$scope', '$http', '$state', '$cookieStore','$timeout', function($scope, $http, $state, $cookieStore,$timeout) {
    $scope.user_data = {}
    $scope.activeClass = false;
    $scope.httpStatus = false;
    $scope.attended = false;
    $scope.course={};
    $scope.alerts = [
      // { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
      // { type: 'info', msg: 'Heads up! This alert needs your attention, but it is not super important.' },
      // { type: 'warning', msg: 'Warning! Best check yo self, you are not looking too good...' }
      // { type: 'danger', msg: 'Danger! Best check yo self, you are bad.' }
    ];
    $scope.hr = 0;
    $scope.min = 0;
    $scope.secs = 0;

    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    if ($cookieStore.get('globals') != undefined){
        $scope.user_data = $cookieStore.get('globals').currentUser;
        $http.defaults.headers.common['Authorization'] = 'Token ' + $scope.user_data.token;
    }else{
      $state.go('access.signin');
    }
        
    
    (function () {
      $http.get(baseUrl+'attendance/activeclass/').then(
        function (success_response){

          $scope.httpStatus = true;
          if (success_response.data != 'There is no active course!'){
            $scope.activeClass = true;
            $scope.course = success_response.data[0];
            console.log(success_response)
            var course_code =$scope.course.course_code
            time_left(course_code)
          }else {
            $scope.addAlert('warning', 'No currently active classes');
          }
        },
        function (error_response){
          $scope.httpStatus = true;
          $scope.addAlert('danger', 'Server Error');
        });

    })();

    function time_left (course_code){
      $http.get(baseUrl+'course/time_left/'+course_code+'/')
      .success( function (response){
        var duration = response;
        var CountDown = function(){
          duration--;
          $scope.hr = 0;
          $scope.secs = duration % 60;
          $scope.min = Math.floor(duration/60);
          if ($scope.min >=60){
            $scope.hr = Math.floor($scope.min/60);
            $scope.min = $scope.min%60;
          }
          if (duration == 0){
            $timeout.cancel(myCountDown);            
          }else{
            myCountDown = $timeout(CountDown, 1000)
          }
        }       
        
        var myCountDown = $timeout(CountDown, 1000)

      })
      .error(function (response){
        $scope.addAlert('danger','Error fetching time left to end class!')
        

      });

    }



    $scope.attend = function (){
         $http({
        method: 'POST',
        url: baseUrl+'attendance/',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
        },
        data: {course_code: $scope.course.course_code, 
                    matric_no: $scope.user_data.id_no,
                    status:true,
                    duration: $scope.course.duration
                  }
      })
      .success(function (response){
        for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i);
        };
        if (response.success){
          $scope.addAlert('success','You have successfully marked attendance for this class')
        }
        else{
          $scope.addAlert('danger','You can only mark attendance once')
        }        
        $scope.loading = false;
        $scope.attended = true;
      })
      .error(function (data,status,header){
        for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i);
          };
        if (data.detail){
          $scope.addAlert('danger',data.detail)
          $scope.loading = false;        
        }
        else{
          $scope.addAlert('danger','Error marking attendance!')
          $scope.loading = false;  
          console.log(data)      

        }
      });
    }

    $scope.userHistory = function (){
      // get student history on classes attended, just for better user interaction
    }



}]);