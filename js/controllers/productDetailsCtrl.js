myApp.controller('productDetailsCtrl', function($scope, baseSvc, $uibModal, $rootScope, $state) {
	var token = localStorage.getItem("token");
	if(!token){
		location.href="login.html"
	}
	
	$scope.product = JSON.parse(localStorage.getItem("product"));
	
	$rootScope.title = "Product Details";
});


