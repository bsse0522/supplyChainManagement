myApp.controller('purchaseDetailsCtrl', function ($scope, baseSvc, $uibModal, $rootScope, $stateParams) {
	var token = localStorage.getItem("token");
	if (!token) {
		location.href = "login.html"
	}

	if ($rootScope.role.indexOf("purchase_wise_report") == -1) {
		$rootScope.withoutPermission();
	}

	$rootScope.title = "Purchase Details";

	baseSvc.get("warehouse/purchaseWiseReport?id=" + $stateParams.id)
		.then(function (response) {
			console.log(response);
			$scope.purchase = response.purchase;
			$scope.purchase.created_at = new Date($scope.purchase.created_at.date);
			$scope.sales = response.sales;
			$scope.pl = response.pl;
		});

	$scope.printDiv = function (divName) {
		document.getElementById("button").style.display = 'none';
		var printContents = document.getElementById(divName).innerHTML;
		document.getElementById("button").style.display = 'block';
		var popupWin = window.open('', '_blank', 'width=1000,height=1000');
		popupWin.document.open();
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/style.css" /><link href="css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWin.document.close();
	}
});


