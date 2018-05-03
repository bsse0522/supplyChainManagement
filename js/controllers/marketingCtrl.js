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

	$scope.printDiv = function (divName) {
		var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=1000,height=1000');
		popupWin.document.open();
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/style.css" /><link href="css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWin.document.close();
	}
	
});