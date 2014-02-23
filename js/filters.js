angular.module("filters", [])
.filter('pagination', function() {
	return function(input, page, size) {
		var start = page * size;
		return input.slice(start, start + size)
	}
})
.filter('search', function($filter) {
	return function(array, exp, comp) {
		if(exp.englishWord.length >= 2) {
			return $filter('filter')(array, exp, comp)		
		}
	}
})