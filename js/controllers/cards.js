'use strict';

/* Controllers */

  // Load Card controller
app.controller('LoadCards', ['$scope','$http', function ($scope,$http) {
    $scope.httpLoading =false;
    $scope.operator;
    $scope.amount;
    // console.log(baseUrl)
    $scope.numbers="";

    $scope.alerts = [
      // { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
      // { type: 'info', msg: 'Heads up! This alert needs your attention, but it is not super important.' },
      // { type: 'warning', msg: 'Warning! Best check yo self, you are not looking too good...' }
    ];

    $scope.addAlert = function(type,message) {
      $scope.alerts.push({type: type, msg: message});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    
    $scope.loadCard = function(){      
      if ($scope.operator == undefined || $scope.amount == undefined || $scope.numbers == undefined){        
        $scope.addAlert('danger','Cannot process form, fill in missing fields');
      }else{
        var cards=[];
        var numsSplit = $scope.numbers.split(/[\s,:;\n\r]+/);
        for (var i = 0; i < numsSplit.length; i++) {
          if (isNaN(numsSplit[i])) {
            $scope.addAlert('danger','Error loading cards, Invalid characters present!');
            var error = true;
            break;
          };
          cards.push(numsSplit[i]);
        };
          if (!error) {
            cards = {"pins":cards};        
            var loadUrl = baseUrl+"card/enqueue/"+$scope.operator+"/"+$scope.amount+"/";  

            $http.post(loadUrl,cards)
            .success(function (data){
            $scope.httpLoading=false;      
            // console.log(data)
            $scope.addAlert('success','Cards successfully loaded');
            })
            .error(function (data,status, headers, config){
            $scope.httpLoading=false;      
            $scope.addAlert('danger','Sorry, we could not load cards at this time');
            });
          };        
      };     

    };    

  }]);


// Contoller for card logs
app.controller('cardLogs',['$scope','$http', function ($scope,$http) {
  $scope.httpStatus=false;
  $scope.counts={'mtn':{},'air':{},'eti':{},'glo':{}};
  var card_counts={};
  var countUrl = baseUrl+"card/count/";
  $scope.alerts = [];

  $scope.addAlert = function(type,message) {
    $scope.alerts.push({type: type, msg: message});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };


  $http.get(countUrl)
  .success(function (data){
    $scope.httpStatus = true;
    card_counts=data["count"];        
    // var card_counts ={"mtn:200":5,"air:500":20,"eti:200":10,"air:100":40,"mtn:750":110,"air:1000":0,"glo:500":0,"mtn:100":0,"glo:100":45,"air:200":0,"mtn:1500":20,"mtn:400":0,"glo:200":20,"eti:100":320,"glo:1000":2330,"eti:500":3430,"eti:1000":50};
    for (var key in card_counts) {
      var network_key = key.split(":");
      if (network_key[0] == 'mtn') {
        $scope.counts['mtn'][network_key[1]] = card_counts[key];        
      };
      if (network_key[0] == 'air') {
        $scope.counts['air'][network_key[1]] = card_counts[key];        
      };
      if (network_key[0] == 'eti') {
        $scope.counts['eti'][network_key[1]] = card_counts[key];        
      };
      if (network_key[0] == 'glo') {
        $scope.counts['glo'][network_key[1]] = card_counts[key];        
      };
    }; 
  })
  .error(function (data,status,headers,config) {
    $scope.httpStatus = true;    
    $scope.addAlert('danger', 'Error loading card counts, try again later')
  });

    

}]);