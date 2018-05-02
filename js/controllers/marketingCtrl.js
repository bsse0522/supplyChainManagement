myApp.controller('marketingCtrl', function ($scope, baseSvc, $uibModal, $rootScope,$state) {
	var token = localStorage.getItem("token");
	
	$scope.dtInstance = null;
	if (!token) {
		location.href = "login.html"
	}
	if ($rootScope.role.indexOf("marketing_view")==-1) {
		$rootScope.withoutPermission();
	}
	$rootScope.title = "Marketing";
	$scope.products = [];
	$scope.getProducts = function(){
		baseSvc.get("available/products")
			.then(function(response){
				$scope.products = response;
			});
		
	}
	$scope.getProducts();
	
});