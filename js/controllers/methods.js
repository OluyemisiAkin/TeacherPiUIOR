'use strict';

/* Controllers */

// Recharge Methods controller
app.controller('manageMethods', ['$scope','$http', function ($scope,$http) {
  $scope.httpLoading =false;
  var methodUrl = baseUrl+"methods/status/";
  

  $scope.alerts = [];

  $scope.addAlert = function(type,message) {
    $scope.alerts.push({type: type, msg: message});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  $scope.methods={'data':{'network': 'mtn', 'balance': 7700.0, 'status': 'master', 'phone': '08137474080', 'user': {'id': 1}, 'amount': 100.0, 'recipient': '08137474080', 'method': 'FlexiRecharge'}, 'datetime': "2015-08-06 15:18:24.629250", 'bal': 20000, 'status': 'PENDING'};
  // console.log($scope.methods);


  // $http.get(methodUrl)
  // .success(function (data){
  //   $scope.httpLoading = true;
  //   // $scope.methods = data["status"];
  //   $scope.methods = data;    
  //   // console.log(JSON.parse($scope.methods["Transaction:FlexiRecharge:db_pop"]['data']));
  // })
  // .error(function (data){
  //   $scope.httpLoading = true;    
  //   $scope.addAlert('danger','Error Loading Methods!')
  // });

  $scope.updateMethod = function(id) {
    // body...
  }


  }]);