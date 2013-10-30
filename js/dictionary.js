angular.module('dictionaryApp', ["entriesResource", "ngRoute"])
.config(function($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider
		.when('/list', {templateUrl: 'templates/list.html', controller: 'listController'})
		.when('/add',  {templateUrl: 'templates/add.html', controller: 'addController'})
		.otherwise({redirectTo: '/list'});
})
//db connection config
.constant('MONGOLAB_CONFIG', {
	DB_NAME: 'dict',
	API_KEY: 'DMXpO9AqPJbloiV0hGkgnuRD45pyGGSx'
})
.factory('Entries', function(entriesResource){
	return entriesResource('EntriesCollection')
})
.filter('pagination', function() {
	return function(input, page, size) {
		var start = page * size;
		return input.slice(start, start + size)
	}
})
.controller('mainController', function ($scope) {

})
.controller('listController', function ($scope, Entries) {
	$scope.entries = [];
	$scope.currentPage = 0;
	$scope.pageSize = 5;
	$scope.englishQuery = "";
	$scope.polishQuery = "";
	$scope.reverse = false;
	$scope.searchedEntries = [];
	$scope.pages = [];

	$scope.setPage = function(page) {
		if(page >= 0 && page < $scope.pages.length) {
			$scope.currentPage = page;
		}
		return false;
	}

	$scope.$watch('searchedEntries.length', function(filteredSize){
		if(filteredSize) {
			$scope.pages = [];
			$scope.currentPage = 0;
			var noOfPages = Math.ceil(filteredSize / $scope.pageSize);
			for (var i = 0; i < noOfPages; i++) {
				$scope.pages.push(i);
			}
		}
	});

	Entries.query().then(function(resp) {
		$.each(resp, function(i, ob) {
			$scope.entries.push({
				_id: ob._id.$oid,
				englishWord: ob.englishWord,
				translatedWord: ob.translatedWord
			})
		});
	}, function(resp) {
		console.log('there was problem with database connection', resp)
	});

	$scope.update = function(data) {
		var user = new Entries(data).$update();
	}
})
.controller('addController', function ($scope, Entries) {
	$scope.save = function(data) {
		var user = new Entries(data).$save();
	}
})