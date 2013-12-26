angular.module('dictionaryApp', ["entriesResource", "ngRoute"])
.config(function($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider
		.when('/list', {templateUrl: 'templates/list.html', controller: 'listController'})
		.when('/add',  {templateUrl: 'templates/change.html', controller: 'addController'})
		.when('/change/:entryId',  {
			templateUrl: 'templates/change.html',
			controller: 'changeController',
			resolve: {
				entry: function($route, Entries) {
					return  Entries.getSingleEntry($route.current.params.entryId);
				}
			}
		})
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
.directive('pagination', function() {
	return {
		restrict: 'E',
		scope: {
			filteredSize: '=',
			currentPage: '=',
			onSelectPage: '&',
			pageSize: '='
		},
		template:
			'<div class="pagination">' +
				'<ul class="pagination-list">' +
					'<li ng-class="{disabled: noPrevious()}""><a ng-click="selectPrevious()">Previous</a></li>' +
					'<li ng-repeat="page in pages" ng-class="{active: isActive(page)}"><a ng-click="setPage(page)">{{page + 1}}</a></li>' +
					'<li ng-class="{disabled: noNext()}"><a ng-click="selectNext()">Next</a></li>' +
				'</ul>' +
			'</div>',
		replace: true,
		link: function($scope) {
			$scope.noOfPages = 0;
			$scope.$watch('filteredSize', function(value) {
				if(value) {
					$scope.pages = [];
					$scope.currentPage = 0;
					$scope.noOfPages = Math.ceil(value / $scope.pageSize);
					for (var i = 0; i < $scope.noOfPages; i++) {
						$scope.pages.push(i);
					}
				}
			});
			$scope.isActive = function(page) {
				return $scope.currentPage === page;
			};

			$scope.setPage = function(page) {
				if(page >= 0 && page < $scope.noOfPages) {
					$scope.currentPage = page;
				}
			};

			$scope.selectPrevious = function() {
				$scope.setPage($scope.currentPage - 1);
			};
			$scope.selectNext = function() {
				$scope.setPage($scope.currentPage + 1);
			};

			$scope.noPrevious = function() {
				return $scope.currentPage === 0;
			}

			$scope.noNext = function() {
				return $scope.currentPage === $scope.noOfPages - 1;
			}
		}
	};
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
	$scope.filteredSize;

	$scope.$watch('searchedEntries.length', function(filteredSize){
		$scope.filteredSize = filteredSize;
	});

	//static entries collection without ajax request
	//$scope.entries = JSON.parse('[{"_id":"52656e1ee4b0703e69c4cc97","englishWord":"sir","translatedWord":"pan"},{"_id":"526ab034e4b0e8555757d672","englishWord":"make","translatedWord":"robić"},{"_id":"526ab03ce4b09daba44a39e5","englishWord":"ghost","translatedWord":"duch"},{"_id":"526bd0cfe4b0e483fb8ae614","englishWord":"hey","translatedWord":"cześć"},{"_id":"526bd0d7e4b0e483fb8ae618","englishWord":"hey","translatedWord":"witam"},{"_id":"526d3800e4b0ea9607de1800","englishWord":"car","translatedWord":"samochód"},{"_id":"526d3f3ce4b0ea9607de204d","englishWord":"bike","translatedWord":"rower"},{"_id":"522f4321e4b072a157fa2468","englishWord":"green","translatedWord":"zielony, zieleń"},{"_id":"526ab028e4b09daba44a39d3","englishWord":"little","translatedWord":"mały, malutki"},{"englishWord":"vital","translatedWord":"istotny"},{"_id":"5270f7d7e4b00774deac82bd","englishWord":"fog","translatedWord":"mgła"},{"_id":"527135bee4b09a602c24e23d","englishWord":"hey","translatedWord":"halo"},{"_id":"527135bfe4b09a602c24e23e","englishWord":"hey","translatedWord":"test2"},{"_id":"527135c2e4b09a602c24e23f","englishWord":"hey","translatedWord":"test3"},{"_id":"526bd0f9e4b0e483fb8ae62c","englishWord":"hey","translatedWord":"dzień dobry"},{"_id":"52762271e4b0e32eb01e77b0","englishWord":"important","translatedWord":"ważny"},{"_id":"52762285e4b0e32eb01e77be","englishWord":"vital","translatedWord":"istotny, ważny"}]');
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
	$scope.resetSearch = function() {
		$scope.englishQuery = "";
		$scope.polishQuery = "";
	}
})
.controller('addController', function ($scope, Entries) {
	$scope.info = "";
	$scope.put = function(data) {
		var user = new Entries(data).$save();
		$scope.info = "entry saved:)"
	}
})
.controller('changeController', function($scope, $routeParams, Entries, entry) {
	$scope.entry = {};
	$scope.info = "";
	var id = $routeParams.entryId;
	$scope.entry = entry;
	$scope.put = function(data) {
		var user = new Entries(data).$update();
		$scope.info = "entry saved:)"
	}
})