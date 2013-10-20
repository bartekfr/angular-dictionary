var dictionaryApp = angular.module('dictionaryApp', ["entriesResource"]);
 
dictionaryApp.constant('MONGOLAB_CONFIG', {
	DB_NAME: 'dict',
	API_KEY: 'DMXpO9AqPJbloiV0hGkgnuRD45pyGGSx'
})
.factory('Entries', function(entriesResource){
	return entriesResource('EntriesCollection')

})
.controller('entriesController', function entriesController($scope, Entries) {
	$scope.entries = [];
	/*var responsePromise = $http.get('https://api.mongolab.com/api/1/databases/dict/collections/EntriesCollection',{
		params:{
			apiKey: 'DMXpO9AqPJbloiV0hGkgnuRD45pyGGSx'
		}
	});*/
	Entries.query().then(function(resp) {
		$.each(resp, function(i, ob) {
			$scope.entries.push({
				english: ob.englishWord,
				polish: ob.translatedWord
			})
		});
	}, function(resp) {
		console.log('there was problem with database connection', resp)
	});

});