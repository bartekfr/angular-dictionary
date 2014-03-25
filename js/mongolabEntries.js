angular.module('entriesResource', [])
.factory('entriesResource', ['$http', 'MONGOLAB_CONFIG', function ($http, MONGOLAB_CONFIG) {

	return function (collectionName) {
		//basic configuration
		var collectionUrl =
			'https://api.mongolab.com/api/1/databases/' +
				MONGOLAB_CONFIG.DB_NAME +
				'/collections/' + collectionName;

		var defaultParams = {apiKey:MONGOLAB_CONFIG.API_KEY};

		//utility methods
		var getId = function (data) {
			return data._id.$oid;
		};

		//a constructor for new resources
		var Resource = function (data) {
			angular.extend(this, data);
		};
		//get
		Resource.query = function (params) {
			var get = $http.get(collectionUrl, {
				params:angular.extend({q:JSON.stringify({} || params)}, defaultParams)
			});
			return get.then(function (response) {
					var result = [];
					angular.forEach(response.data, function (value, key) {
						result[key] = new Resource(value);
					});
					return result;
				});
		};
		//save
		Resource.save = function (data) {
			return $http.post(collectionUrl, data, {params: defaultParams})
				.then(function (response) {
					return new Resource(data);
				});
		};

		Resource.prototype.$save = function () {
			return Resource.save(this);
		};

		//update
		Resource.update = function (data) {
			var url = collectionUrl +  '/' + data._id;
			var sendData = {
				englishWord: data.englishWord,
				translatedWord: data.translatedWord
			};
			return $http.put(url, sendData, {params: defaultParams})
				.then(function (response) {
					return new Resource(sendData);
				});
		};

		Resource.getSingleEntry = function (id) {
			var url = collectionUrl +  '/' + id;
			return $http.get(url, {params: defaultParams})
				.then(function (response) {
					return {
						_id: id,
						englishWord: response.data.englishWord,
						translatedWord: response.data.translatedWord
					};
				});
		};

		Resource.prototype.$getSingleEntry = function (id) {
			return Resource.getSingleEntry(id);
		};

		//delete
		Resource.remove = function (id) {
			return $http.delete(collectionUrl + '/' + id, {params: defaultParams})
				.then(function (response) {
					return response;
				});
		};

		Resource.prototype.$remove = function (id) {
			return Resource.remove(this._id);
		};

		//convenience methods
		Resource.prototype.$id = function () {
			return getId(this);
		};

		return Resource;
	};
}]);
