var dictionaryApp = angular.module('dictionaryApp', ["entriesResource"]);
 
dictionaryApp.constant('MONGOLAB_CONFIG', {
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
.controller('entriesController', function entriesController($scope, Entries) {
	$scope.entries = [];
	$scope.page = 0;
	$scope.pageSize = 5;
	$scope.dataLength = 0;
	$scope.englishQuery = "";
	$scope.polishQuery = "";
	/*var responsePromise = $http.get('https://api.mongolab.com/api/1/databases/dict/collections/EntriesCollection',{
		params:{
			apiKey: 'DMXpO9AqPJbloiV0hGkgnuRD45pyGGSx'
		}
	});*/

	Entries.query().then(function(resp) {
		$.each(resp, function(i, ob) {
			$scope.entries.push({
				_id: ob._id.$oid,
				english: ob.englishWord,
				polish: ob.translatedWord
			})
		});
		$scope.dataLength = $scope.entries.length;
	}, function(resp) {
		console.log('there was problem with database connection', resp)
	});
	//

	$scope.setPage = function(page) {
		if(page >= 0 && page < $scope.dataLength / $scope.pageSize) {
			$scope.page = page;
		}
		return false;
	}
	$scope.update = function(data) {
		var user = new Entries(data).$update();;
	}
});