var dictionaryApp = angular.module('dictionaryApp', ["ngResource"]);
 
dictionaryApp.controller('entriesController', function entriesController($scope, $http) {
	$scope.entries = [];
	var responsePromise = $http.get('https://api.mongolab.com/api/1/databases/dict/collections/EntriesCollection',{
		params:{
			apiKey: 'DMXpO9AqPJbloiV0hGkgnuRD45pyGGSx'
		}
	});
	responsePromise.then(function(resp) {
		$.each(resp.data, function(i, ob) {
			$scope.entries.push({
				english: ob.englishWord,
				polish: ob.translatedWord
			})
		});
	}, function(resp) {
		console.log('there was problem with database connection', resp)
	});

});