myApp.controller('profitLossCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
	var token = localStorage.getItem("token");
	if (!token) {
		location.href = "login.html"
	}
	if ($rootScope.role.indexOf("profit_loss")==-1) {
		$rootScope.withoutPermission();
	}
	$rootScope.title = "Profit and Loss";
	$scope.showingProfitLoss = false;
	$scope.showTrialBalance = false;
	var d = new Date();
	$scope.date = new Date();
	$scope.today = "" + d.getMonth + "\/" + d.getDate() + "\/" + d.getFullYear();
	$scope.printDiv = function (divName) {
		var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=1000,height=1000');
		popupWin.document.open();
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/style.css" /><link href="css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWin.document.close();
	}

	$scope.isItalicAccount = function(type){
		if(type){
			return '';
		}
		else {
			return 'italic-account';
		}
	}
	$scope.showProfitLoss = function (from, to) {
		from = new Date(from);
		to = new Date(to);
		var fd = "" + from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
		var td = "" + to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
		baseSvc.get("profit-loss?from=" + fd + "&to=" + td )
			.then(function (response) {
                $scope.showingProfitLoss = true;
				$scope.profitLoss = response;
				$scope.profitLoss.revenue.indirect.accounts = [];
				if($scope.profitLoss.gross_type == 'loss'){
					$scope.profitLoss.revenue.direct.accounts.push({
						name: "Gross loss",
						balance: $scope.profitLoss.gross_value,
						type: true
					})
					$scope.profitLoss.expense.indirect.accounts.push({
						name: "Gross loss b/f",
						balance: $scope.profitLoss.gross_value,
						type: true
					})
					$scope.gross_total = $scope.profitLoss.expense.direct.total;
					if($scope.profitLoss.net_type == 'loss'){
						$scope.net_total = $scope.profitLoss.gross_value+$scope.profitLoss.expense.indirect.total;
					}
					else {
						$scope.net_total = $scope.profitLoss.revenue.indirect.total;
					}
				}
				else {
					$scope.profitLoss.expense.direct.accounts.push({
						name: "Gross profit",
						balance: $scope.profitLoss.gross_value,
						type: true
					})
					$scope.profitLoss.revenue.indirect.accounts.push({
						name: "Gross profit b/f",
						balance: $scope.profitLoss.gross_value,
						type: true
					})
					$scope.gross_total = $scope.profitLoss.revenue.direct.total;
					if($scope.profitLoss.net_type == 'loss'){
						$scope.net_total = $scope.profitLoss.expense.indirect.total;
					}
					else {
						$scope.net_total = $scope.profitLoss.gross_value+$scope.profitLoss.revenue.indirect.total;
					}
				}

				if($scope.profitLoss.net_type == 'loss'){
					$scope.profitLoss.revenue.indirect.accounts.push({
						name: "Net loss",
						balance: $scope.profitLoss.net_value,
						type: true
					})
				}
				else {
					$scope.profitLoss.expense.indirect.accounts.push({
						name: "Net profit",
						balance: $scope.profitLoss.net_value,
						type: true
					})
				}

				if($scope.profitLoss.expense.direct.accounts.length>$scope.profitLoss.revenue.direct.accounts.length){
					var num = $scope.profitLoss.expense.direct.accounts.length - $scope.profitLoss.revenue.direct.accounts.length;
					for(var i=0;i<num;i++){
						$scope.profitLoss.revenue.direct.accounts.push({
							name: "",
							balance: "",
							type: true
						})
					}
				}
				else {
					var num = $scope.profitLoss.revenue.direct.accounts.length - $scope.profitLoss.expense.direct.accounts.length;
					for(var i=0;i<num;i++){
						$scope.profitLoss.expense.direct.accounts.push({
							name: "",
							balance: "",
							type: true
						})
					}
				}

				if($scope.profitLoss.expense.indirect.accounts.length>$scope.profitLoss.revenue.indirect.accounts.length){
					var num = $scope.profitLoss.expense.indirect.accounts.length - $scope.profitLoss.revenue.indirect.accounts.length;
					for(var i=0;i<num;i++){
						$scope.profitLoss.revenue.indirect.accounts.push({
							name: "",
							balance: "",
							type: true
						})
					}
				}
				else {
					var num = $scope.profitLoss.revenue.indirect.accounts.length - $scope.profitLoss.expense.indirect.accounts.length;
					for(var i=0;i<num;i++){
						$scope.profitLoss.expense.indirect.accounts.push({
							name: "",
							balance: "",
							type: true
						})
					}
				}
			});
	}
});