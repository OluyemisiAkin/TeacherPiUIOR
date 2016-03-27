app.controller('MaterialUploadCtrl', ['$scope', 'FileUploader', '$cookieStore','$http', function($scope, FileUploader,$cookieStore,$http) {
    $scope.alerts =[];
    $scope.selected_course= "";
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


        
    var uploader = $scope.uploader = new FileUploader({
        headers : {'Authorization': 'Token ' + $scope.user_data.token},
        url: baseUrl+'file/upload/'
    });
    console.log(uploader['headers']['Authorization'])

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {  
        item.url = baseUrl+'file/upload/'+ $scope.selected_course.course_code+'/';
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
}]);