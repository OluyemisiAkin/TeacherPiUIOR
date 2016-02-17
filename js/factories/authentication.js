app.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', 
	function ($http, $cookieStore, $rootScope){
		var factory = {};
        this.role = "student";
        
        factory.Login = function Login(username, password, success_callback, error_callback){        
            $http.post(baseUrl+'student/login/', {'username': username, 'password':password})
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


        factory.SetCredentials = function SetCredentials (username, token, success_callback, error_callback) {
        	// $rootScope.globals = {
         //        currentUser: {
         //            username: username,
         //            token: token
         //        }
         //    };
         //    $cookieStore.put('globals', $rootScope.globals);
            $http.defaults.headers.common['Authorization'] = 'Token ' + token;
            $http.get(baseUrl+'student/userDetails/')
	            .success(function (response){
	            	var user_data = response
	            	$rootScope.globals = {
		                currentUser: {
		                    username: username,
		                    token: token,
		                    id_no: user_data['matric_no'],
		                    first_name: user_data['first_name'],
		                    last_name: user_data['last_name'],
		                    is_staff: user_data['is_staff']
		                }
	            	};
                    $cookieStore.put('globals', $rootScope.globals);
                    if (user_data['is_staff']){
                        this.role = 'staff'
                    }
                    success_callback(user_data['is_staff']);
	            })
                .error(function (response){
                    error_callback(response);
                });     
        }

        factory.ClearCredentials = function ClearCredentials () {
        	$rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
        factory.GetPermissions = function GetPermissions (){
            return this.role;
        }

        return factory;

}])