angular.module("filters", [])
.filter('pagination', function() {
	return function(input, page, size) {
		var start = page * size;
		return input.slice(start, start + size)
	}
})