angular.module('entriesResource', [])
.factory('entriesResource', function ($http, MONGOLAB_CONFIG) {

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

		Resource.save = function (data) {
			return $http.post(collectionUrl, data, {params: defaultParams})
				.then(function (response) {
					return new Resource(data);
				});
		};

		Resource.prototype.$save = function (data) {
			return Resource.save(this);
		};

		Resource.update = function (data) {
			var url = collectionUrl +  '/' + data._id;
			var sendData = {
				englishWord: data.english,
				translatedWord: data.polish
			}
			return $http.put(url, sendData, {params: defaultParams})
				.then(function (response) {
					return new Resource(sendData);
				});
		};

		Resource.prototype.$update = function (data) {
			return Resource.update(this);
		};

		Resource.remove = function (data) {
			return $http['delete'](collectionUrl + '', defaultParams)
				.then(function (response) {
					return new Resource(data);
				});
		};

		Resource.prototype.$remove = function (data) {
			return Resource.remove(this);
		};

		//other CRUD methods go here

		//convenience methods
		Resource.prototype.$id = function () {
			return getId(this);
		};

		return Resource;
	};
});