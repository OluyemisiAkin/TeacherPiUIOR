$scope.fileUpload = function (element) {
        $scope.$apply(function (scope) {
            var file = element.files[0];
            FileInputService.readFileAsync(file).then(function (fileInputContent) {
                $scope.fileInputContent = fileInputContent;
                var numbers = $scope.fileInputContent.split(/[\n]+/);
                numbers = numbers.slice(1, numbers.length-1);
                matric_nos = [];
                for (var num in numbers){
                  var n = numbers[num].split(/[,]+/)[1];
                  matric_nos.push(n);                  
                }
            });
        });
    };