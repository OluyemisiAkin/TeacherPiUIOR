'use strict';
app.controller('MaterialManageCtrl', ['$scope', '$http', '$state', '$cookieStore','$filter',function($scope, $http, $state, $cookieStore, $filter) {
    $scope.alerts = [];
    $scope.courses = {};
    $scope.httpStatus1 = false;
    $scope.httpStatus2 = true;
    $scope.found = false;
    $scope.found2 = false;    

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
        if (status == 401){
         $state.go('access.signin',{logout:true, msg:'Session timed out or you ended the class!'});
        }
        else{
          $scope.addAlert('danger', 'Error loading course list');
          $scope.httpStatus1 = true;
        }
      });

    $scope.loadList = function(code){
      $scope.httpStatus2 = false;
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
              $scope.httpStatus2 = true;  
              return;
            }
            
            // var newd = $filter('date')($scope.files[0]['timestamp'], 'mediumTime')
            for (var file in $scope.files) {
              $scope.file_item = $scope.files[file]              
            }
            $scope.count = $scope.files.length
            $scope.httpStatus2 = true;           
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
              $scope.httpStatus2 = true;
            }
          });
      }    
    }
    
    $scope.delete = function(file_name){
      $scope.loading = true;
      console.log(file_name)
      $http.delete(baseUrl+'file/delete_file/'+file_name+'/')
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
        console.log(data)
        if (status == 401){
         $state.go('access.signin',{logout:true, msg:'Session timed out or you ended the class!'});
        }
        else{
          $scope.addAlert('danger', 'Error loading deleting file');
          $scope.httpStatus1 = true;
        }
      });

    }

    $scope.convertToSlides = function(course_code, file_name){
      file_name = file_name.split(".")[0]
       $http.get(baseUrl+'projector/convert_to_slide/'+course_code+'/'+file_name+'/')
        .success(function (response) {
            $scope.addAlert('success', response);           
        })
        .error(function (data, status, headers){
            if (status == 401){
                $state.go('access.signin',{logout:true, msg:'Session timed out or you ended the class!'});
            }
            else{
                $scope.addAlert('danger', data);
                $scope.httpStatus1 = true;
            }
        });
    }

   //  $scope.delete = function (file_name){
   //    $http({
   //          method: 'DELETE',
   //          url: baseUrl+'file/delete_file/',
   //          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
   //          transformRequest: function(obj) {
   //            var str = [];
   //          for(var p in obj)
   //            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
   //          return str.join("&");
   //          },
   //          data: {file_name: file_name}
   //        })
   //        .success(function (response){
   //          $scope.addAlert('success',file_name + ' deleted succesfully')            
   //          $scope.loading = false;
   //          // $state.reload();
   //        })
   //        .error(function (data,status,header){
   //        if (status == 401){
   //          $state.go('access.signin',{logout:true, msg:'Session timed out!'});
   //        }
   //        else{
   //          $scope.addAlert('danger','Error deleting file')
   //          $scope.loading = false;          
   //        }
   //        });
   // }


     


}]);