angular.module('dictionaryLogin', [])
.factory('loginService', ['$http', '$location', '$q', function ($http, $location, $q) {
	var username;
	var password;
	var loginData = {
		loginStatus: sessionStorage.getItem("loggedIn") || false
	};
	function logIn(user, passwd) {

		//simualte data received from server
		return $q.when({
			username: "test",
			password: "test"
		}).then(function(res) {
			if((user === res.username && passwd === res.password)) {
				loginData.loginStatus = true;
				sessionStorage.setItem("loggedIn", "yes");
				return true
			}
			logOut();
			return loginData.loginStatus;
		});
	};
	function logOut() {
		loginData.loginStatus = false;
		sessionStorage.removeItem("loggedIn");
	};
	return {
		logIn: logIn,
		loginData: loginData,
		logOut: logOut
	}
}]);
