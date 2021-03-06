myApp.controller('warehouseDashboardCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
	var token = localStorage.getItem("token");
	if(!token){
		location.href="login.html"
	}
	if($rootScope.role.indexOf('supplier_view')!=-1 || $rootScope.role.indexOf('buyer_view')!=-1 || $rootScope.role.indexOf('color_view')!=-1 || $rootScope.role.indexOf('size_view')!=-1 ||
						$rootScope.role.indexOf('category_view')!=-1 || $rootScope.role.indexOf('warehouse_purchase_view')!=-1 || $rootScope.role.indexOf('warehouse_sale_view')!=-1){
		
	}
	else {
		$rootScope.checkPermissions();
	}
	// if ($rootScope.role != 'warehouse') {
	// 	$rootScope.withoutPermission();
	// }
	$scope.printDiv = function (divName) {
		var printContents = document.getElementById(divName).innerHTML;
		var popupWin = window.open('', '_blank', 'width=1000,height=1000');
		popupWin.document.open();
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/style.css" /><link href="css/bootstrap.min.css" rel="stylesheet"></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWin.document.close();
	}
	$rootScope.title = "Warehouse Dashboard";
	
	$scope.supplier = {};
	
	$scope.getCompletePurchases = function(){
		baseSvc.get("all/purchases")
			.then(function(response){
				//console.log(response);
				$scope.purchases = response;
				$scope.purchases.forEach(function(node){
					node.created_at = new Date(node.created_at);
				});
			});
	}
	$scope.getCompletePurchases();
	
	$scope.getCompleteSales = function(){
		baseSvc.get("all/sales")
			.then(function(response){
				//console.log(response);
				$scope.sales = response;
				$scope.sales.forEach(function(node){
					node.created_at = new Date(node.created_at);
				});
			});
	}
	$scope.getCompleteSales();
	
	$scope.showPurchaseInfo = function(purchase){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/accounts/showCompletePurchase.html',
			controller: 'ViewCompletePurchaseInfoModalCtrl',
			resolve: {
				purchase: function() {
					return purchase;
				}
			}
		});
		
		modalInstance.result.then(function (item) {
			//console.log(item);
			if(item.success==true){
				$scope.getIncompletePurchases();
				alert("Added successfully.")
			}
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.showSaleInfo = function(sale){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/accounts/showCompleteSale.html',
			controller: 'ViewCompleteSaleInfoModalCtrl',
			resolve: {
				sale: function() {
					return sale;
				}
			}
		});
		
		modalInstance.result.then(function (item) {
			//console.log(item);
			if(item.success==true){
				$scope.getIncompletePurchases();
				alert("Added successfully.")
			}
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.getSuppliers = function(){
		baseSvc.get("suppliers")
			.then(function(response){
				console.log(response);
				$scope.suppliers = response;
				
			});
	}
	$scope.getSuppliers();

	$scope.getBuyers = function(){
		baseSvc.get("buyers")
			.then(function(response){
				//console.log(response);
				$scope.buyers = response;
				
			});
	}
	$scope.getBuyers();
	
	$scope.getCategories = function(){
		baseSvc.get("categories")
			.then(function(response){
				$scope.categories = response;
			});
	}
	$scope.getCategories();
	
	$scope.getColors = function(){
		baseSvc.get("colors")
			.then(function(response){
				$scope.colors = response;
			});
	}
	
	$scope.getColors();
	
	$scope.getSizes = function(){
		baseSvc.get("sizes")
			.then(function(response){
				$scope.sizes = response;
			});
	}
	
	$scope.getSizes();
	
	$scope.addNewSupplier=function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/purchase/addSupplierModal.html',
			controller: 'ModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			baseSvc.post({
				supplier: item.company,
				company: item.company,
				mobile: item.mobile,
				address: item.address
			}, "warehouse/supplier/store")
				.then(function(response){
					if(response.supplier){
						$scope.getSuppliers();
					}
					else if(response.status){
						alert(response.status);
					}
					else{
						alert("error occured.")
					}
				})
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
		
	}
	
	$scope.addNewCategory = function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/purchase/addCategoryModal.html',
			controller: 'ModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			baseSvc.post({category:item.name}, "warehouse/category/store")
				.then(function(response){
					if(response.category){
						$scope.getCategories();
					}
					else if(response.status){
						alert(response.status);
					}
					else {
						alert("Error occured");
					}
				})
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.addNewSubcategory = function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/warehouseDashboard/addSubcategoryModal.html',
			controller: 'SubcategoryAddModalInstanceCtrl',
			resolve: {
				categories: function(){
					return $scope.categories;
				}
			}
		});
		
		modalInstance.result.then(function (item) {
			baseSvc.post({
				category_id: item.category,
				subcategory: item.name
			}, "warehouse/subcategory/store")
				.then(function(response){
					if(response.subcategory){
						$scope.getCategories();
					}
					else if(response.status){
						alert(response.status);
					}
					else {
						alert("Error occured");
					}
				})
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.addNewColor = function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/purchase/addColorModal.html',
			controller: 'ModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			//console.log(item);
			baseSvc.post({
				color: item.name,
				hex: item.hex
			}, "warehouse/color/store")
				.then(function(response){
					if(response.color){
						$scope.getColors();
					}
					else if(response.status){
						alert(response.status);
					}
					else {
						alert("Error occured");
					}
				})
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	$scope.addNewSize = function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/purchase/addSizeModal.html',
			controller: 'ModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			//console.log(sizes);
			baseSvc.post({size:item.name}, "warehouse/size/store")
				.then(function(response){
					if(response.size){
						$scope.getSizes();
					}
					else if(response.status){
						alert(response.status);
					}
					else {
						alert("Error occured");
					}
				})
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
});


myApp.controller('SubcategoryAddModalInstanceCtrl', function ($scope, $uibModalInstance, categories) {
	$scope.categories = categories;
	
	$scope.ok = function (item) {
		$uibModalInstance.close(item);
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});