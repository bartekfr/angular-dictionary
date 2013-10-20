var dictionaryApp = angular.module('dictionaryApp', []);
 
dictionaryApp.controller('entriesController', function entriesController($scope, $http) {
	$scope.entries = [];
	$http.get('https://api.mongolab.com/api/1/databases/dict/collections/EntriesCollection',{
		params:{
			apiKey: 'DMXpO9AqPJbloiV0hGkgnuRD45pyGGSx'
		}
	}).success(function(resp) {
		$.each(resp, function(i, ob) {
			$scope.entries.push({
				english: ob.englishWord,
				polish: ob.translatedWord
			})
		})
	});

});