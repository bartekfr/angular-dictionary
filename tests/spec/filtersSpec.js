describe('filter', function() {

	beforeEach(module('filters'));

	describe('spacesToDashes', function() {
		it('should replace spaces in string with dashes', inject(function(spacesToDashesFilter) {
			expect(spacesToDashesFilter('ala ma kota')).toEqual('ala-ma-kota');
		}));
	});

	describe('dashesToSpaces', function() {
		it('should replace dashes in string with spaces', inject(function(dashesToSpacesFilter) {
			expect(dashesToSpacesFilter('ala-ma-kota')).toEqual('ala ma kota');
		}));
	});

	describe('searching', function() {
		var list = [
			{
				englishWord: 'cat'
			},		{
				englishWord: 'mysterious'
			}
		];

		it('should return result only if query is longer than 1', inject(function(searchFilter) {
			expect(searchFilter(list, {englishWord: 'mys'})).toEqual([{englishWord: 'mysterious'}]);
			expect(searchFilter(list, {englishWord: 'my'})).toEqual([{englishWord: 'mysterious'}]);
			expect(searchFilter(list, {englishWord: 'm'})).toBeUndefined();
			expect(searchFilter(list, {englishWord: ''})).toBeUndefined();
		}));
	})
});





