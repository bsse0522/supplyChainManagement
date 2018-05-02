myApp.controller('accountsIncompletePurchaseCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
	var token = localStorage.getItem("token");
	if (!token) {
		location.href = "login.html"
	}

	if ($rootScope.role.indexOf("accounts_purchase_view")==-1) {
		$rootScope.withoutPermission();
	}

	$rootScope.title = "Accounts Admin Dashboard (Purchases)";

	$scope.incompletePurchases = [];

	$scope.getIncompletePurchases = function () {
		baseSvc.get("incomplete/purchases")
			.then(function (response) {
				//console.log(response);
				$scope.incompletePurchases = response;
			});
	}
	$scope.getCompletePurchases = function () {
		baseSvc.get("due/purchases")
			.then(function (response) {
				console.log(response);
				$scope.duePurchases = response;
			});
		baseSvc.get("paid/purchases")
			.then(function (response) {
				console.log(response);
				$scope.paidPurchases = response;
			});
		baseSvc.get("extended/purchases")
			.then(function (response) {
				console.log(response);
				$scope.extendedPurchases = response;
			});
	}

	$scope.getIncompletePurchases();
	$scope.getCompletePurchases();

	$scope.addAccountsInfo = function (purchase) {
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/accounts/addInfo.html',
			controller: 'AddInfoModalInstanceCtrl',
			size: 'lg',
			resolve: {
				purchase: function () {
					return purchase;
				}
			}
		});

		modalInstance.result.then(function (item) {
				$scope.getIncompletePurchases();
				$scope.getCompletePurchases();
				alert("Added successfully.");
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	$scope.addPaymentToPurchase = function (purchase) {
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/accounts/addPaymentToPurchase.html',
			controller: 'AddPaymentModalInstanceCtrl',
			size: 'lg',
			resolve: {
				purchase: function () {
					return purchase;
				}
			}
		});

		modalInstance.result.then(function (item) {
				$scope.getIncompletePurchases();
				$scope.getCompletePurchases();
				alert("Added successfully.");
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	$scope.editAccountsInfo = function (purchase) {
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/accounts/editPurchaseInfo.html',
			controller: 'EditInfoModalInstanceCtrl',
			size: 'lg',
			resolve: {
				purchase: function () {
					return purchase;
				}
			}
		});

		modalInstance.result.then(function (item) {
				$scope.getIncompletePurchases();
				$scope.getCompletePurchases();
				alert("Added successfully.");
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	$scope.showPurchaseInfo = function (purchase) {
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/accounts/showIncompletePurchase.html',
			controller: 'ViewIncompletePurchaseInfoModalCtrl',
			resolve: {
				purchase: function () {
					return purchase;
				}
			}
		});

		modalInstance.result.then(function (item) {
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}

	$scope.showCompletePurchaseInfo = function (purchase) {
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/accounts/showCompletePurchase.html',
			controller: 'ViewCompletePurchaseInfoModalCtrl',
			resolve: {
				purchase: function () {
					return purchase;
				}
			}
		});

		modalInstance.result.then(function (item) {
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
});

myApp.controller('AddInfoModalInstanceCtrl', function ($scope, $uibModalInstance, purchase, baseSvc) {
	$scope.item = {};
	$scope.addingInfo = false;
	angular.copy(purchase, $scope.item);
	
	$scope.total = 0;
	//console.log($scope.item);

	$scope.item.product.forEach(function (node) {
		node.payment_category = "1";
		node.payment_type = "1";
		node.partial = {}
	});

	$scope.getLedgers = function () {
		baseSvc.get("accounts/ledgers/bank_accounts")
			.then(function (response) {
				//console.log(response);
				$scope.ledgers = response;
			});
	}
	$scope.getLedgers();

	$scope.calculateTotal = function(){
		$scope.total = 0;
		if(!isNaN(parseInt($scope.item.transport))){
			$scope.total += parseInt($scope.item.transport);
		}
		if(!isNaN(parseInt($scope.item.labour))){
			$scope.total += parseInt($scope.item.labour);
		}
		if(!isNaN( parseInt($scope.item.discount))){
			$scope.total -= parseInt($scope.item.discount);
		}
		if(!isNaN(parseInt($scope.item.other))){
			$scope.total += parseInt($scope.item.other);
		}
		$scope.item.product.forEach(function (node) {
			if(!isNaN(parseInt(node.price))){
				$scope.total+=parseInt(node.price)*node.stock;
			}
		});
	}

	$scope.save = function (item) {
		$scope.addingInfo = true;
		var data = {
			"purchaseId": item.id,
			"transport": item.transport ? item.transport : null,
			"labour": item.labour ? item.labour : null,
			"vat": item.vat == 1 ? 1 : null,
			"discount": item.discount ? item.discount : null,
			"others": item.other ? item.other : null,
			"products": []
		};
		item.product.forEach(function (node) {
			var product = {
				"id": node.id,
				"price": node.price,
				"total": node.stock * node.price,
				"payment_category": node.payment_category,
				"payment_type": node.payment_type,
				"partial": {
					"cash": node.partial.cash ? node.partial.cash : null,
					"check": node.partial.check ? node.partial.check : null
				},
				"check": node.check ? node.check.name : null
			};
			data.products.push(product);
		});
		//console.log(data);
		baseSvc.post({
			purchase: JSON.stringify(data)
		}, "accounts/purchase/price/store")
			.then(function (response) {
				$scope.addingInfo = false;
				if (response.message == "created") {
					$uibModalInstance.close(purchase);
				}
				else {
					alert("Error occured.")
				}
			})
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

myApp.controller('AddPaymentModalInstanceCtrl', function ($scope, $uibModalInstance, purchase, baseSvc) {
	$scope.item = {};
	$scope.addingInfo = false;
	angular.copy(purchase, $scope.item);
	//console.log($scope.item);

	$scope.item.product.forEach(function (node) {
		node.payment_category = "1";
		node.payment_type = "1";
		node.partial = {};
		node.price = node.purchase_unit_price;
	});

	$scope.getLedgers = function () {
		baseSvc.get("accounts/ledgers/bank_accounts")
			.then(function (response) {
				//console.log(response);
				$scope.ledgers = response;
			});
	}
	$scope.getLedgers();

	$scope.save = function (item) {
		$scope.addingInfo = true;
		var data = {
			"purchaseId": item.id,
			"transport": item.transport ? item.transport : null,
			"labour": item.labour ? item.labour : null,
			"discount": item.discount ? item.discount : null,
			"others": item.other ? item.other : null,
			"products": []
		};
		item.product.forEach(function (node) {
			var product = {
				"id": node.id,
				"price": node.price,
				"total": node.stock * node.price,
				"payment_category": node.payment_category,
				"payment_type": node.payment_type,
				"partial": {
					"cash": node.partial.cash ? node.partial.cash : null,
					"check": node.partial.check ? node.partial.check : null
				},
				"check": node.check ? node.check.name : null
			};
			data.products.push(product);
		});
		//console.log(data);
		baseSvc.post({
			purchase: JSON.stringify(data)
		}, "accounts/add/payment/purchase")
			.then(function (response) {
				$scope.addingInfo = false;
				if (response.message == "created") {
					$uibModalInstance.close(purchase);
				}
				else {
					alert("Error occured.")
				}
			})
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});



myApp.controller('EditInfoModalInstanceCtrl', function ($scope, $uibModalInstance, purchase, baseSvc) {
	$scope.item = {};
	$scope.addingInfo = false;
	angular.copy(purchase, $scope.item);
	console.log($scope.item);
	
	$scope.total = 0;
	$scope.itemHis = JSON.parse($scope.item.accounts_purchase_historie[0].history);
	for (var i = 0; i < $scope.item.product.length; i++) {
		//console.log($scope.itemHis.products[i]);
		if ($scope.itemHis.products[i]) {
			$scope.item.product[i].price = $scope.itemHis.products[i].price;
			$scope.item.product[i].payment_category = $scope.itemHis.products[i].payment_category;
			$scope.item.product[i].payment_type = $scope.itemHis.products[i].payment_type;
			$scope.item.product[i].partial = {};
			$scope.item.product[i].partial.cash = $scope.itemHis.products[i].partial.cash;
			$scope.item.product[i].partial.check = $scope.itemHis.products[i].partial.check;
			$scope.item.product[i].check = $scope.itemHis.products[i].check;
		}
		else {
			$scope.item.product[i].payment_category = "1";
			$scope.item.product[i].payment_type = "1";
			$scope.item.product[i].partial = {};
		}
	}

	$scope.calculateTotal = function(){
		$scope.total = 0;
		if(!isNaN(parseInt($scope.item.transport))){
			$scope.total += parseInt($scope.item.transport);
		}
		if(!isNaN(parseInt($scope.item.labour))){
			$scope.total += parseInt($scope.item.labour);
		}
		if(!isNaN( parseInt($scope.item.discount))){
			$scope.total -= parseInt($scope.item.discount);
		}
		if(!isNaN(parseInt($scope.item.other))){
			$scope.total += parseInt($scope.item.other);
		}
		$scope.item.product.forEach(function (node) {
			if(!isNaN(parseInt(node.price))){
				$scope.total+=parseInt(node.price)*node.stock;
			}
		});
	}
	$scope.calculateTotal();
	$scope.getLedgers = function () {
		baseSvc.get("accounts/ledgers/bank_accounts")
			.then(function (response) {
				//console.log(response);
				$scope.ledgers = response;
			});
	}
	$scope.getLedgers();

	$scope.save = function (item) {
		$scope.addingInfo = true;
		var data = {
			"purchaseId": item.id,
			"transport": item.transport ? item.transport : null,
			"labour": item.labour ? item.labour : null,
			"vat": item.vat == 1 ? 1 : null,
			"discount": item.discount ? item.discount : null,
			"others": item.other ? item.other : null,
			"products": []
		};
		item.product.forEach(function (node) {
			var product = {
				"id": node.id,
				"price": node.price,
				"total": node.stock * node.price,
				"payment_category": node.payment_category,
				"payment_type": node.payment_type,
				"partial": {
					"cash": node.partial.cash ? node.partial.cash : null,
					"check": node.partial.check ? node.partial.check : null
				},
				"check": node.check ? node.check.name : null
			};
			data.products.push(product);
		});
		//console.log(data);
		baseSvc.post({
			purchase: JSON.stringify(data)
		}, "accounts/update/price/purchase")
			.then(function (response) {
				$scope.addingInfo = false;
				if (response.message == "updated") {
					$uibModalInstance.close(purchase);
				}
				else {
					alert("Error occured.")
				}
			})
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

myApp.controller('ViewIncompletePurchaseInfoModalCtrl', function ($scope, $uibModalInstance, purchase, baseSvc, $state) {
	$scope.item = purchase;
	$scope.item.created_at = new Date($scope.item.created_at);
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.showProductDetails = function (product) {
		localStorage.setItem("product", JSON.stringify(product));
		var url = $state.href('productDetails');
		window.open(url, '_blank');
	}
});

myApp.controller('ViewCompletePurchaseInfoModalCtrl', function ($scope, $uibModalInstance, purchase, baseSvc, $state) {
	$scope.item = purchase;
	$scope.item.created_at = new Date($scope.item.created_at);
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.showProductDetails = function (product) {
		localStorage.setItem("product", JSON.stringify(product));
		var url = $state.href('productDetails');
		window.open(url, '_blank');
	}
});