//fileInputService.js
app.service('FileInputService', function ($q) {

    this.readFileAsync = function (file) {
        var deferred = $q.defer(),
        fileReader = new FileReader(),
        fileName = file.name,
        fileType = file.type,
        fileSize = file.size;
        lastModified = file.lastModified;
        lastModifiedDate = file.lastModifiedDate;
        fileReader.readAsText(file);

        /*Reference: Other options*/
        //fileReader.readAsDataURL(file);
        //fileReader.readAsBinaryString(file);
        //fileReader.readAsArrayBuffer(file);

        fileReader.onload = function (e) {
            deferred.resolve(e.target.result);
        };
        return deferred.promise;
    };
});





/*myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);*/

