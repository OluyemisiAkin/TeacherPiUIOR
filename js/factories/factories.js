app.factory('otherServices', ['$http', '$cookieStore', '$timeout','AuthenticationService','$state',
  function ($http, $cookieStore, $timeout, AuthenticationService, $state){
    var factory = {};                
        
        factory.timeLeft = function(course_code,success_callback, error_callback){
          $http.get(baseUrl+'course/time_left/'+course_code+'/')
            .success( function (response){
              var duration = response;
              var CountDown = function(){
                duration--;
                var hr = 0;
                var secs = duration % 60;
                var min = Math.floor(duration/60);
                if (min >=60){
                  hr = Math.floor(min/60);
                  min = min%60;
                }
                if (duration <= 0){
                  $timeout.cancel(myCountDown);
                  // AuthenticationService.Logout(); 
                  // $state.go('access,signin');                           
                  $state.go('access.signin',{logout:true});
                }else{
                  myCountDown = $timeout(CountDown, 1000)
                }
                success_callback([hr, min, secs])
              }               
              var myCountDown = $timeout(CountDown, 1000)            

            })
            .error(function (response){
              error_callback(response)       
            });
        }

       

        return factory;

}])