angular.module('dictionaryLogin', [])
.factory('Users', ['entriesResource', function (entriesResource){
	return entriesResource('Users');
}])
.factory('loginService', ['$http', '$location', '$q', 'Users', function ($http, $location, $q, Users) {
	var username;
	var password;
	var loginData = {
		loginStatus: sessionStorage.getItem("loggedIn") || false
	};
	function logIn(user, passwd) {
		return Users.query({
			q: {
				"username": user
			}
		}).then(function(res) {
			var res = res[0];
			if((res.username === user &&  res.password === passwd)) {
				loginData.loginStatus = true;
				sessionStorage.setItem("loggedIn", "yes");
			} else {
				logOut();
			}
			return loginData.loginStatus;
		});

	};
	function logOut() {
		loginData.loginStatus = false;
		sessionStorage.removeItem("loggedIn");
		console.log('log out');
	};
	return {
		logIn: logIn,
		loginData: loginData,
		logOut: logOut
	}
}]);
