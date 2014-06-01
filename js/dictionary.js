angular.module('dictionaryApp', ["entriesResource", "ngRoute", "dictionaryLogin", "directives", "filters"])
.config(['$routeProvider', '$locationProvider', function ($routeProvider,$locationProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider
		//.when('/list', {templateUrl: 'templates/list.html', controller: 'listController'})
		.when('/list/:word?', {templateUrl: 'templates/list.html', controller: 'listController', 'public': true})
		.when('/add',  {templateUrl: 'templates/change.html', controller: 'addController', 'public': false})
		.when('/login',  {templateUrl: 'templates/login.html', controller: 'loginController', 'public': true})
		.when('/change/:entryId',  {
			templateUrl: 'templates/change.html',
			controller: 'changeController',
			'public': false,
			resolve: {
				entry: function($route, Entries) {
					return  Entries.getSingleEntry($route.current.params.entryId);
				}
			}
		})
		.otherwise({redirectTo: '/list'});
}])
.run(['$rootScope', 'loginService', '$location', function ($rootScope, loginService, $location){
	$rootScope.$on('$routeChangeStart', function(current, next) {
		var isLogged = loginService.loginData.loginStatus;
		var publicRoute = next.public;
		if(!isLogged && !publicRoute) {
			console.log('routeChaneStart event: you are not logged');
			$location.path('/login');
		} else {
			console.log('routeChaneStart event: logged=' + isLogged + ', allowedPath=' + publicRoute);
		}
	});
	$rootScope.$on('$routeChangeError', function (current, next) {
		console.log('url doesnt exists');
		$location.path('/list');
	});
}])
//db connection config
.constant('MONGOLAB_CONFIG', {
	DB_NAME: 'dict',
	API_KEY: 'qUxqL9tqS3G-MbTZLJgdH8Ob4e1Yve_p'
})
.factory('Entries', ['entriesResource', function (entriesResource){
	return entriesResource('EntriesCollection');
}])
.controller('mainController', ['$scope', 'loginService', function ($scope, loginService){
		$scope.loginData = loginService.loginData;
		$scope.logOut = loginService.logOut;
		$scope.$watch("loginData.loginStatus", function(status){
			$scope.loginMessage = status ? "Logged in": "Not logged in";
		});
		/*$rootScope.$watch('isLogged', function(c){
			console.log('roooor', c)
		})*/
}])
.controller('loginController', ['$scope', '$rootScope', 'loginService', '$location', function ($scope, $rootScope, loginService, $location) {
	$scope.message = "";
	$scope.login = function() {
		loginService.logIn($scope.username, $scope.password).then(function (res){
			if(res) {
				$rootScope.isLogged = true;
				$location.path('/list');
			} else {
				$scope.message = "Username and email don't match. Please try again";
			}
		});
	};
}])
.controller('listController', ['$scope', 'Entries', 'orderByFilter', '$routeParams', '$filter', 'loginService', function ($scope, Entries, orderByFilter, $routeParams, $filter, loginService) {
	$scope.loginData = loginService.loginData;
	$scope.entries = [];
	$scope.currentPage = 0;
	$scope.pageSize = 5;
	$scope.englishQuery = "";
	$scope.polishQuery = "";
	$scope.reverse = false;
	$scope.searchedEntries = [];
	$scope.pages = [];
	//$scope.filteredSize;
	var dashesToSpaces = $filter('dashesToSpaces');
	$scope.word = dashesToSpaces($routeParams.word);
	$scope.entriesSearched = [];

/*	$scope.$watch('entriesSearched.length', function (filteredSize){
		$scope.filteredSize = filteredSize;
	});*/

	//static entries collection without ajax request
	//$scope.entries = JSON.parse('[{"_id":"52656e1ee4b0703e69c4cc97","englishWord":"sir","translatedWord":"pan"},{"_id":"526ab034e4b0e8555757d672","englishWord":"make","translatedWord":"robić"},{"_id":"526ab03ce4b09daba44a39e5","englishWord":"ghost","translatedWord":"duch"},{"_id":"526bd0cfe4b0e483fb8ae614","englishWord":"hey","translatedWord":"cześć"},{"_id":"526bd0d7e4b0e483fb8ae618","englishWord":"hey","translatedWord":"witam"},{"_id":"526d3800e4b0ea9607de1800","englishWord":"car","translatedWord":"samochód"},{"_id":"526d3f3ce4b0ea9607de204d","englishWord":"bike","translatedWord":"rower"},{"_id":"522f4321e4b072a157fa2468","englishWord":"green","translatedWord":"zielony, zieleń"},{"_id":"526ab028e4b09daba44a39d3","englishWord":"little","translatedWord":"mały, malutki"},{"englishWord":"vital","translatedWord":"istotny"},{"_id":"5270f7d7e4b00774deac82bd","englishWord":"fog","translatedWord":"mgła"},{"_id":"527135bee4b09a602c24e23d","englishWord":"hey","translatedWord":"halo"},{"_id":"527135bfe4b09a602c24e23e","englishWord":"hey","translatedWord":"test2"},{"_id":"527135c2e4b09a602c24e23f","englishWord":"hey","translatedWord":"test3"},{"_id":"526bd0f9e4b0e483fb8ae62c","englishWord":"hey","translatedWord":"dzień dobry"},{"_id":"52762271e4b0e32eb01e77b0","englishWord":"important","translatedWord":"ważny"},{"_id":"52762285e4b0e32eb01e77be","englishWord":"vital","translatedWord":"istotny, ważny"}]');
	Entries.query().then(function (resp) {
		$.each(resp, function(i, ob) {
			$scope.entries.push({
				_id: ob._id.$oid,
				englishWord: ob.englishWord,
				translatedWord: ob.translatedWord
			});
		});
		$scope.entries = orderByFilter($scope.entries, "englishWord");
	}, function(resp) {
		console.log('there was problem with database connection', resp);
	});
	$scope.resetSearch = function() {
		$scope.englishQuery = "";
		$scope.polishQuery = "";
	};
}])
.controller('addController', ['$scope', 'Entries', function ($scope, Entries) {
	$scope.info = "";
	$scope.put = function(data) {
		var user = new Entries(data).$save();
		$scope.info = "entry saved:)";
	};
}])
.controller('changeController', ['$scope', '$location', '$routeParams', 'Entries', 'entry', function ($scope, $location, $routeParams, Entries, entry) {
	$scope.entry = {};
	$scope.info = "";
	$scope.deleteBtn = true;
	var id = $routeParams.entryId;
	$scope.entry = entry;

	$scope.put = function(data) {
		var user = Entries.update(data).then(function () {
			$scope.info = "entry saved:)";
		});

	};
	$scope.delete = function() {
		Entries.remove(id).then(function() {
			$scope.info = "entry deleted:(";
				$location.path('/list');
		});
	};
}]);