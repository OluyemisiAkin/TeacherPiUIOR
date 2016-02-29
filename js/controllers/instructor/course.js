'use strict';

/* Controllers */
  // signin controller
app.controller('Course', ['$scope', '$http', '$state', '$cookieStore','$stateParams','$location','$q','FileInputService','$filter',
  function($scope, $http, $state, $cookieStore, $stateParams, $location, $q, FileInputService, $filter) {
    $scope.alerts = [];
    $scope.course = {};    
    var update = false;
    $scope.numbers="";
    // $scope.started = false;
    //loading was used for the buttons and httpStatus used for main image of full dat load


    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    if ($stateParams.to_edit){
      $scope.course = angular.fromJson($stateParams.to_edit);
      update = true;
      loadCanTakeCourse($scope.course.course_code);
    };
    if ($stateParams.msg){
      $scope.addAlert('success', $stateParams.msg);
    };

        
    if ($cookieStore.get('globals') != undefined){
        $scope.user_data = $cookieStore.get('globals').currentUser;
        $http.defaults.headers.common['Authorization'] = 'Token ' + $scope.user_data.token;
        // console.log($http.defaults.headers.common['Authorization'])
    }else{
      $state.go('access.signin');
    }
        
    // $scope.clear = function(){
    //   $location.search('')
    //   $scope.course = null
    // }

    //**********create course************/
    $scope.createCourse = function(){
      $scope.loading = true;
      for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i);
      };
      if (update==true){
          $http({
          method: 'PUT',
          url: baseUrl+'course/',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
          },
          data: $scope.course
        })
        .success(function (response){
          $scope.addAlert('success','Course succesfully Updated')
          $scope.course = {}
          $scope.loading = false;
        })
        .error(function (data,status,header){
          $scope.addAlert('danger','Server error')
          $scope.loading = false;          
        });

      }
      else{
        $http({
        method: 'POST',
        url: baseUrl+'course/',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
        },
        data: $scope.course
      })
      .success(function (response){
        $scope.addAlert('success','Course succesfully registered')
        $scope.course = {};
        $scope.loading = false;
      })
      .error(function (data,status,header){
        $scope.loading = false;        
        $scope.addAlert('danger','Server error')
      });
      }
    };

    $scope.studentData = function(){
      $scope.matric_nos = $scope.course.numbers
      var nos = $scope.matric_nos.split(/[\s,:;\n\r]+/);

      $http.post(baseUrl+'course/can_take_course/',{course_code: $scope.course.course_code, can_take_course: nos})
      .success(function (response){
        $scope.addAlert('success','Student data uploaded')
        $scope.course = {};
        $scope.loading = false;
      })
      .error(function (data,status,header){
        $scope.loading = false;        
        $scope.addAlert('danger','Server error')
      });
          
   }

    $scope.fileInputContent = "";
    $scope.fileUpload = function (element) {
        $scope.$apply(function (scope) {
            var file = element.files[0];
            FileInputService.readFileAsync(file).then(function (fileInputContent) {
                $scope.fileInputContent = fileInputContent;
                console.log($scope.fileInputContent)

            });
        });
    };



    //*************course list************//
   if ($state.current.name == 'app2.instructor.course'){
    $http.get(baseUrl+'course/')
      .success(function (response) {
        $scope.courses= response;
        $scope.httpStatus = true;

      })
      .error(function (data, status, headers){
        $scope.addAlert('danger', 'Error loading course list');
        $scope.httpStatus = true;
      });

      $http.get(baseUrl+'attendance/activeclass/')
      .success(function (response) {
        var active_classes= response;
        for (var clas in active_classes){
          for (var c in $scope.courses){
            if ($scope.courses[c].course_code == active_classes[clas].course_code){
              $scope.courses[c].started = true;
            }       

            };
        };
      })
      .error(function (data, status, headers){
        $scope.addAlert('danger', 'Error loading active classes');
        $scope.httpStatus = true;
      });
   };
   //load active clases


   $scope.editCourse = function (course) {
    var to_edit = angular.toJson(course)    
    $state.go('app2.instructor.course-create',{to_edit:to_edit});
   };  

   $scope.deleteCourse = function (course){
      $http({
            method: 'DELETE',
            url: baseUrl+'course/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
              var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
            },
            data: {course_code: course.course_code}
          })
          .success(function (response){
            $scope.addAlert('success','Course with code ' + course.course_code + ' deleted succesfully')
            var msg = 'Course with code ' + course.course_code + ' deleted succesfully'
            $scope.course = {};
            $scope.loading = false;
            // $state.reload();
            $state.go($state.current, {msg:msg}, {reload: true, inherit: true, notify: true});
          })
          .error(function (data,status,header){
            $scope.addAlert('danger','Error deleting course')
            $scope.loading = false;          
          });
   }

   function loadCanTakeCourse (code) {   
     $http.get(baseUrl+'course/can_take_course/'+code+'/')
        .success(function (response) {
          $scope.course.numbers = response;
        })
        .error(function (data, status, headers){
          $scope.addAlert('danger', 'Error loading attendance list');
          $scope.httpStatus1 = true;
        });
   };  

   $scope.startClass = function (code,duration){
     $http({
        method: 'POST',
        url: baseUrl+'attendance/activeclass/',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
        },
        data: {course_code:code, duration:duration}
      })
      .success(function (response){
        for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i);
        };
        $scope.addAlert('success','Class succesfully started')
        $scope.course = {};
        for (var c in $scope.courses){
          if($scope.courses[c].course_code == code){
            $scope.courses[c].started = true;
          }
        }
        $scope.loading = false;       
              
      })
      .error(function (data,status,header){
        for (var i = $scope.alerts.length - 1; i >= 0; i--) {
            $scope.closeAlert(i);
          };
        $scope.loading = false;        
        $scope.addAlert('danger','Error starting class, please try again')
      });
   };

   $scope.stopClass = function(code){
      for (var i = $scope.alerts.length - 1; i >= 0; i--) {
              $scope.closeAlert(i);
          };
     $http.get(baseUrl+'attendance/stop_class/')
      .success(function (response) {
          // $scope.downloadList(code)          //download attendance list
          $scope.addAlert('success', 'Class succesfully stopped');
             for (var c in $scope.courses){
                if($scope.courses[c].course_code == code){
                  $scope.courses[c].started = false;
                }
              }  
          $scope.loading = false;     
      })
      .error(function (data, status, headers){
        $scope.addAlert('danger', 'Error stopping class');
        $scope.loading = false;
      });


   };


   /**** Download attendance list *** just copied and pasted from attendance.js, can make dis better 
   ***** by making the export a service***/

   $scope.downloadList = function(code){      
      if (code != undefined){
         $http.get(baseUrl+'attendance/attendance_list/'+code+'/')
          .success(function (response) {
            for (var i = $scope.alerts.length - 1; i >= 0; i--) {
              $scope.closeAlert(i);
            };
            $scope.students= response;
            $scope.exportData = [];

            var newd = $filter('date')($scope.students[0]['timestamp'], 'mediumTime')
            for (var student in $scope.students) {
              $scope.exportData.push({matric_no: $scope.students[student]['matric_no'], 
                                              date: $filter('date')($scope.students[student]['timestamp'] *1000, 'mediumDate'),
                                              time: $filter('date')($scope.students[student]['timestamp'] *1000, 'mediumTime')})
            }
            $scope.count = $scope.students.length
            $scope.httpStatus2 = true;
            if ($scope.students.length == 0){
              $scope.addAlert('warning','No student data found for this class!');
              $scope.found2 = false;
              return;
            }
            $scope.found2 = true;
          })
          .error(function (data, status, headers){
            for (var i = $scope.alerts.length - 1; i >= 0; i--) {
              $scope.closeAlert(i);
            };
            $scope.addAlert('danger', 'Error fetchin attendance list');
            $scope.httpStatus1 = true;
          });
      }    
    }
    $scope.getHeader = function () {return ['Matric Number', 'Date', 'Time']};


   

  }]);