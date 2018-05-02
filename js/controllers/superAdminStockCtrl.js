myApp.controller('superAdminStockCtrl', function ($scope, baseSvc, $uibModal, $rootScope,$state) {
	var token = localStorage.getItem("token");
	if (!token) {
		location.href = "login.html"
	}
	if ($rootScope.role.indexOf("stock")==-1) {
		$rootScope.withoutPermission();
	}
	$rootScope.title = "Stock";
	$scope.supplier = "-1";
	$scope.category = "-1";
	$scope.selectedCategory = "-1";
	$scope.subcategory = "-1";
	baseSvc.get("suppliers")
		.then(function(response){
			$scope.suppliers = response;
		});
	
	baseSvc.get("categories")
		.then(function(response){
			$scope.categories = response;
		});

	$scope.categorySelected = function(category) {
		console.log(category);
		category = JSON.parse(category);
		if(category=="-1"){
			$scope.selectedCategory = "-1";
		}
		else {
			$scope.subcategories = category.sub_category;
			$scope.selectedCategory = category.id;
		}
	}

	$scope.filter = function() {
		baseSvc.get("filter/stock?category_id="+$scope.selectedCategory+"&sub_category_id="+$scope.subcategory+"&supplier_id="+$scope.supplier)
			.then(function(response){
				$scope.products = response;
				console.log($scope.products);
			});
	}
	
	$scope.getProducts = function(){
		baseSvc.get("available/products")
			.then(function(response){
				$scope.products = response;
				console.log($scope.products);
			});
	}
	$scope.getProducts();
	
	$scope.goToProductDetailsEdit = function(){
		$state.go('productDetailsUpdate');
	}
	
	$scope.showProductDetails = function (product){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/superDashboard/productDetailsModal.html',
			controller: 'ProductDetailsModalCtrl',
			resolve: {
				item: function() {
					return product;
				}
			}
		});
		
		modalInstance.result.then(function (item) {
			console.log('Modal dismissed at: ' + new Date());
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
});


myApp.controller('ProductDetailsModalCtrl', function ($scope, $uibModalInstance, item) {
	$scope.product = item;
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});