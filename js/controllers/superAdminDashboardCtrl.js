myApp.controller('superAdminDashboardCtrl', function ($scope, baseSvc, $uibModal, $rootScope, $stateParams, $state) {
	var token = localStorage.getItem("token");
	if (!token) {
		location.href = "login.html"
	}
	
	$rootScope.title = "Super Admin Dashboard";
	
	if($stateParams.message){
		alert($stateParams.message);
	}
	
	$scope.suppliers = [];
	$scope.supplier = null;
	$scope.purchases = [];
	$scope.purchaseTimeRange = 'today';
	$scope.purchaseQuantity = 0;
	$scope.purchaseValue = 0;
	$scope.saleTimeRange = 'today';
	$scope.saleQuantity = 0;
	$scope.saleValue = 0;
	
	baseSvc.get("suppliers")
		.then(function (response) {
			$scope.suppliers = response;
			
		});
	
	baseSvc.get("buyers")
		.then(function (response) {
			$scope.buyers = response.filter(function(node){
				return node.company!=null;
			});
		});

	$scope.supplierSelected = function(item, model){
		$scope.supplier = item;
		baseSvc.get("super/supplierWise/reports?id="+item.id)
		.then(function (response) {
			$scope.suppliersPurchases = response.purchase;
			$scope.suppliersPurchases.forEach(function(node){
				node.created_at = new Date(node.created_at);
			})
		});
	}
	
	$scope.purchaseTypeChanged = function (type) {
		baseSvc.get("super/timeWise/purchases?time=" + type)
			.then(function (response) {
				$scope.purchases = response;
				//console.log(response);
				$scope.purchaseQuantity = 0;
				$scope.purchaseValue = 0;
				$scope.purchases.forEach(function (purchase) {
					purchase.created_at = new Date(purchase.created_at);
					purchase.quantity = 0;
					purchase.value = 0;
					purchase.product.forEach(function (product) {
						purchase.quantity += product.initial_stock;
						if (purchase.status != '0') {
							purchase.value += (product.initial_stock * product.purchase_unit_price);
						}
					});
					
					$scope.purchaseQuantity += purchase.quantity;
					$scope.purchaseValue += purchase.value;
				});
			});
	}
	
	$scope.purchaseTypeChanged($scope.purchaseTimeRange);

	$scope.saleTypeChanged = function (type) {
		baseSvc.get("super/timeWise/sales?time=" + type)
			.then(function (response) {
				$scope.sales = response;
				//console.log(response);
				$scope.saleQuantity = 0;
				$scope.saleValue = 0;
				$scope.sales.forEach(function (sale) {
					sale.created_at = new Date(sale.created_at);
					sale.quantity = 0;
					sale.value = 0;
					sale.product.forEach(function (product) {
						sale.quantity += product.pivot.total_amount;
						if (sale.status != '0') {
							sale.value += (product.pivot.total_amount * product.pivot.price);
						}
					});
					
					$scope.saleQuantity += sale.quantity;
					$scope.saleValue += sale.value;
				});
			});
	}
	
	$scope.saleTypeChanged($scope.saleTimeRange);
	
	// function showJournal(date){
	//     var modalInstance = $uibModal.open({
	//         animation: false,
	//         ariaLabelledBy: 'modal-title',
	//         ariaDescribedBy: 'modal-body',
	//         templateUrl: 'js/templates/journal/journalModal.html',
	//         controller: 'JournalModalCtrl',
	//         size: 'lg',
	//         resolve: {
	//             journals: function() {
	//                 return $scope.journals;
	//             }
	//           }
	//     });
	
	//     modalInstance.result.then(function (item) {
	//         console.log('Modal dismissed at: ' + new Date());
	//     }, function () {
	//         console.log('Modal dismissed at: ' + new Date());
	//     });
	// }
});

// myApp.controller('JournalModalCtrl', function ($scope, $uibModalInstance, journals) {  
//     $scope.journals = journals;
//     $scope.cancel = function () {
//         $uibModalInstance.dismiss('cancel');
//     };
// });