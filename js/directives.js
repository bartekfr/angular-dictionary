angular.module("directives", [])
.directive('pagination', function () {
	return {
		restrict: 'E',
		scope: {
			filteredSize: '=length',
			currentPage: '=',
			onSelectPage: '&',
			pageSize: '='
		},
		template:
			'<div class="pagination">' +
				'<ul class="pagination-list">' +
					'<li ng-class="{disabled: noPrevious()}"><a href ng-click="selectPrevious()">Previous</a></li>' +
					'<li class="item" ng-repeat="page in pages" ng-class="{active: isActive(page)}"><a href ng-click="setPage(page)">{{page + 1}}</span></a>' +
					'<li ng-class="{disabled: noNext()}"><a href ng-click="selectNext()">Next</a></li>' +
				'</ul>' +
			'</div>',
		replace: true,
		link: function($scope) {
			$scope.noOfPages = 0;
			$scope.$watch('filteredSize', function(value) {
				if(value) {
					$scope.pages = [];
					$scope.currentPage = 0;
					$scope.noOfPages = Math.ceil(value / $scope.pageSize);
					for (var i = 0; i < $scope.noOfPages; i++) {
						$scope.pages.push(i);
					}
				}
			});
			$scope.isActive = function(page) {
				return $scope.currentPage === page;
			};

			$scope.setPage = function(page) {
				if(page >= 0 && page < $scope.noOfPages) {
					$scope.currentPage = page;
				}
			};

			$scope.selectPrevious = function() {
				$scope.setPage($scope.currentPage - 1);
			};
			$scope.selectNext = function() {
				$scope.setPage($scope.currentPage + 1);
			};

			$scope.noPrevious = function() {
				return $scope.currentPage === 0;
			}

			$scope.noNext = function() {
				return $scope.currentPage === $scope.noOfPages - 1;
			}
		}
	};
})