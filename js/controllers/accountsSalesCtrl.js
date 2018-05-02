myApp.controller('accountsIncompleteSalesCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html"
    }

    if ($rootScope.role.indexOf("accounts_sale_view")==-1) {
		$rootScope.withoutPermission();
	}

    $rootScope.title = "Accounts Admin Dashboard (Sales)";

    $scope.incompleteSales = [];
    $scope.completeSales = [];

    $scope.getIncompleteSales = function () {
        baseSvc.get("incomplete/sales")
            .then(function (response) {
                //console.log(response);
                $scope.incompleteSales = response;
            });
    }
    $scope.getCompleteSales = function () {
        baseSvc.get("extended/sales")
            .then(function (response) {
                console.log(response);
                $scope.extendedSales = response;
            });
        baseSvc.get("due/sales")
            .then(function (response) {
                console.log(response);
                $scope.dueSales = response;
            });
        baseSvc.get("paid/sales")
            .then(function (response) {
                console.log(response);
                $scope.paidSales = response;
            });
    }

    $scope.getIncompleteSales();
    $scope.getCompleteSales();

    $scope.showCompleteSaleInfo = function (sale) {
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/showCompleteSale.html',
            controller: 'ViewCompleteSaleInfoModalCtrl',
            resolve: {
                sale: function () {
                    return sale;
                }
            }
        });

        modalInstance.result.then(function (item) {
            //console.log(item);
            // if(item.success==true){
            //     $scope.getIncompletePurchases();
            //     alert("Added successfully.")
            // }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.showIncompleteSaleInfo = function (sale) {
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/showIncompleteSale.html',
            controller: 'ViewIncompleteSaleInfoModalCtrl',
            resolve: {
                sale: function () {
                    return sale;
                }
            }
        });

        modalInstance.result.then(function (item) {
            //console.log(item);
            // if(item.success==true){
            //     $scope.getIncompletePurchases();
            //     alert("Added successfully.")
            // }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.addAccountsInfo = function (sale) {
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/addSaleInfo.html',
            controller: 'AddSaleInfoModalInstanceCtrl',
            size: 'lg',
            resolve: {
                sale: function () {
                    return sale;
                }
            }
        });

        modalInstance.result.then(function (item) {
            $scope.getIncompleteSales();
            $scope.getCompleteSales();
            alert("Added successfully.")
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.editAccountsInfo = function (sale) {
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/editSaleInfo.html',
            controller: 'EditSaleInfoModalInstanceCtrl',
            size: 'lg',
            resolve: {
                sale: function () {
                    return sale;
                }
            }
        });

        modalInstance.result.then(function (item) {
            $scope.getIncompleteSales();
            $scope.getCompleteSales();
            alert("Updated successfully.")
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.addPaymentInfo = function (sale) {
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/addPaymentToSale.html',
            controller: 'AddPaymentToSaleInfoModalInstanceCtrl',
            size: 'lg',
            resolve: {
                sale: function () {
                    return sale;
                }
            }
        });

        modalInstance.result.then(function (item) {
            $scope.getIncompleteSales();
            $scope.getCompleteSales();
            alert("Added successfully.")
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
});


myApp.controller('AddSaleInfoModalInstanceCtrl', function ($scope, $uibModalInstance, sale, baseSvc) {
    $scope.item = {};
    $scope.addingInfo = false;
    angular.copy(sale, $scope.item);
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
		if(!isNaN( parseInt($scope.item.discount))){
			$scope.total += parseInt($scope.item.discount);
		}
		$scope.item.product.forEach(function (node) {
			if(!isNaN(parseInt(node.price))){
				$scope.total+=parseInt(node.price)*node.pivot.total_amount;
			}
		});
	}
    $scope.save = function (item) {
        $scope.addingInfo = true;
        var data = {
            "saleId": item.id,
            "discount": item.discount ? item.discount : null,
            "products": []
        };
        item.product.forEach(function (node) {
            var product = {
                "id": node.id,
                "price": node.price,
                "total": node.pivot.total_amount * node.price,
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
        console.log(data);
        baseSvc.post({
            sale: JSON.stringify(data)
        }, "accounts/sale/price/store")
            .then(function (response) {
                $scope.addingInfo = false;
                if (response.message == "created") {
                    $uibModalInstance.close(sale);
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

myApp.controller('AddPaymentToSaleInfoModalInstanceCtrl', function ($scope, $uibModalInstance, sale, baseSvc) {
    $scope.item = {};
    $scope.addingInfo = false;
    angular.copy(sale, $scope.item);
    //console.log($scope.item);

    $scope.item.product.forEach(function (node) {
        node.payment_category = "1";
        node.payment_type = "1";
        node.partial = {}
    });

    $scope.itemHis = JSON.parse($scope.item.accounts_sale_historie[0].history);
	for (var i = 0; i < $scope.item.product.length; i++) {
		if ($scope.itemHis.products[i]) {
            $scope.item.product[i].price = $scope.itemHis.products[i].price;
            $scope.item.product[i].payment_category = "1";
			$scope.item.product[i].payment_type = "1";
			$scope.item.product[i].partial = {};
		}
		else {
			$scope.item.product[i].payment_category = "1";
			$scope.item.product[i].payment_type = "1";
			$scope.item.product[i].partial = {};
		}
	}

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
            "saleId": item.id,
            "discount": item.discount ? item.discount : null,
            "products": []
        };
        item.product.forEach(function (node) {
            var product = {
                "id": node.id,
                "price": node.price,
                "total": node.pivot.total_amount * node.price,
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
        console.log(data);
        baseSvc.post({
            sale: JSON.stringify(data)
        }, "accounts/add/payment/sale")
            .then(function (response) {
                $scope.addingInfo = false;
                if (response.message == "created") {
                    $uibModalInstance.close(sale);
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

myApp.controller('EditSaleInfoModalInstanceCtrl', function ($scope, $uibModalInstance, sale, baseSvc) {
    $scope.item = {};
    $scope.addingInfo = false;
    angular.copy(sale, $scope.item);
    //console.log($scope.item);
    $scope.itemHis = JSON.parse($scope.item.accounts_sale_historie[0].history);
	for (var i = 0; i < $scope.item.product.length; i++) {
		console.log($scope.itemHis.products[i]);
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
		if(!isNaN( parseInt($scope.item.discount))){
			$scope.total += parseInt($scope.item.discount);
		}
		$scope.item.product.forEach(function (node) {
			if(!isNaN(parseInt(node.price))){
				$scope.total+=parseInt(node.price)*node.pivot.total_amount;
			}
		});
    }
    $scope.calculateTotal();
    $scope.save = function (item) {
        $scope.addingInfo = true;
        var data = {
            "saleId": item.id,
            "discount": item.discount ? item.discount : null,
            "products": []
        };
        item.product.forEach(function (node) {
            var product = {
                "id": node.id,
                "price": node.price,
                "total": node.pivot.total_amount * node.price,
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
        console.log(data);
        baseSvc.post({
            sale: JSON.stringify(data)
        }, "accounts/update/price/sale")
            .then(function (response) {
                $scope.addingInfo = false;
                if (response.message == "updated") {
                    $uibModalInstance.close(sale);
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

myApp.controller('ViewIncompleteSaleInfoModalCtrl', function ($scope, $uibModalInstance, sale, baseSvc, $state) {
    $scope.item = sale;
    $scope.item.created_at = new Date($scope.item.created_at);
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

myApp.controller('ViewCompleteSaleInfoModalCtrl', function ($scope, $uibModalInstance, sale, baseSvc, $state) {
    $scope.item = sale;
    $scope.item.created_at = new Date($scope.item.created_at);
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});