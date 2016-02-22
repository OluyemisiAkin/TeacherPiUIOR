app.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', 
	function ($http, $cookieStore, $rootScope){
		var factory = {};
        var role = "student";
        
        factory.Login = function Login(identity, user_type, password, success_callback, error_callback){
            $http.post(baseUrl+'user/login/', {'identity': identity, 'user_type':user_type,'password':password})
            	.success(function (response){
            		success_callback(response);
            	})
            	.error(function (response){
            		error_callback(response);
            	});
        }

        factory.Logout = function Logout(){   
            $http.delete(baseUrl+'student/logout/')
                .success(function (response){
                    factory.ClearCredentials()
                })
                .error(function (response){
                                     
                });
        }

        factory.SetCredentials = function SetCredentials (identity, user_type, token) {
        	// $rootScope.globals = {
         //        currentUser: {
         //            username: username,
         //            token: token
         //        }
         //    };
         //    $cookieStore.put('globals', $rootScope.globals);
            $http.defaults.headers.common['Authorization'] = 'Token ' + token;
            $rootScope.globals = {
                        currentUser: {
                            id_no: identity,
                            token: token,
                            user_type: user_type
                        }
                    };
            $cookieStore.put('globals', $rootScope.globals);
                if (user_type == 'staff'){
                    role = 'staff'
                }                          
        };

        factory.ClearCredentials = function ClearCredentials () {
        	$rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        };
        factory.GetPermissions = function GetPermissions (){
            return role;
        }

        return factory;

}])