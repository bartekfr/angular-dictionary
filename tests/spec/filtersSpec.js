describe('filter', function() {
 
	beforeEach(module('filters'));
	 
	describe('spacesToDashes', function() { 
		it('should replace spaces in string with dashes',
		inject(function(spacesToDashesFilter) {
			expect(spacesToDashesFilter('ala ma kota')).toBe('ala-ma-kota');
	
		}));
	});
	describe('dashedToSPaces', function() { 
		it('should replace dashes in string with spaces',
		inject(function(dashesToSpacesFilter) {
			expect(dashesToSpacesFilter('ala-ma-kota')).toBe('ala ma kota');
	
		}));
	});
});