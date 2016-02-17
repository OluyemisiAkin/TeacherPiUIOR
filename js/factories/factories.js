app.factory('arookoFactory',['$http', function ($http) {
	var arookoFactory = {};

	arookoFactory.alerts = [
      { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
      // { type: 'info', msg: 'Heads up! This alert needs your attention, but it is not super important.' },
      // { type: 'warning', msg: 'Warning! Best check yo self, you are not looking too good...' }
    ];

    arookoFactory.addAlert = function(type,message) {
    	console.log('here')
      return arookoFactory.alerts.push({type: type, msg: message});
    };

    arookoFactory.closeAlert = function(index) {
      return arookoFactory.alerts.splice(index, 1);
    };

	return arookoFactory;


}]);