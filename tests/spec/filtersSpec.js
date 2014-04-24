describe('filter', function() {
 
	beforeEach(module('filters'));
	 
	describe('spacesToDashes', function() { 
		it('should replace spaces in string to dashes',
		inject(function(spacesToDashesFilter) {
			expect(spacesToDashesFilter('ala ma kota')).toBe('ala-ma-kota');
	
		}));
	});
});