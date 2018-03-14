myApp.controller('warehouseSalesEntryCtrl', function($scope, $state, baseSvc, $uibModal, $rootScope) {
	var token = localStorage.getItem("token");
	if(!token){
		location.href="login.html"
	}
	
	if ($rootScope.role != 'warehouse') {
		$rootScope.withoutPermission();
	}
	
	$rootScope.title = "Add Sales";
	
	$scope.buyer = {};
	$scope.product = {};
	$scope.submittingSales = false;
	
	$scope.buyerSelected=function(item, model){
		$scope.buyer=item;
	}
	
	baseSvc.get("buyers")
		.then(function(response){
			$scope.buyers = response.filter(function(node){
				return node.company!=null;
			});
			
			console.log($scope.buyers);
		});
	
	baseSvc.get("available/products")
		.then(function(response){
			$scope.products = response;
		});
	
	$scope.selectedProducts = [];
	
	$scope.productSelected = function(item, selectedProduct){
		$scope.selectedProducts.push(item);
	}
	
	$scope.productRemoved = function(item, selectedProduct){
		$scope.selectedProducts=$scope.selectedProducts.filter(function(node){
			return node.id!=item.id;
		});
	}
	
	$scope.addNewBuyer=function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/warehouseSalesEntry/addBuyerModal.html',
			controller: 'AddBuyerModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			baseSvc.post({
				buyer: item.company,
				company: item.company,
				mobile: item.mobile,
				address: item.address
			}, "warehouse/buyer/store")
				.then(function(response){
					if(response.buyer){
						$scope.buyer = response.buyer;
						$scope.buyers.push($scope.buyer);
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
	
	$scope.submitSales = function() {
		$scope.submittingSales = true;
		var sales = {
			buyerId: $scope.buyer.id,
			reference: $scope.reference,
			products: []
		};
		
		//console.log($scope.selectedProducts);
		$scope.selectedProducts.forEach(function(node){
			var product = {
				id: node.id,
				name: node.name,
				colors: []
			};
			node.colors.forEach(function(element){
				var color = {
					id: element.id,
					name: element.name,
					sizes: []
				};
				element.sizes.forEach(function(item){
					var size = {
						id: item.id,
						name: item.name,
						quantity: item.sellQuantity+""
					};
					color.sizes.push(size);
				});
				product.colors.push(color);
			});
			
			sales.products.push(product);
		})
		
		console.log(JSON.stringify(sales));
		
		baseSvc.post({
			sale: JSON.stringify(sales)
		}, "warehouse/sales/product/store")
			.then(function(response){
				$scope.submittingSales = false;
				if(response.message=='created'){
					alert("Added successfully.")
					$state.go("warehouseDashboard");
				}
				else{
					alert("Error occured.")
				}
			})
	}
});


myApp.controller('AddBuyerModalInstanceCtrl', function ($scope, $uibModalInstance) {
	$scope.ok = function (item) {
		$uibModalInstance.close(item);
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

myApp.controller('warehouseSalesEditCtrl', function($scope, baseSvc, $uibModal, $rootScope) {
	var token = localStorage.getItem("token");
	if(!token){
		location.href="login.html"
	}
	
	if ($rootScope.role != 'warehouse') {
		$rootScope.withoutPermission();
	}
	
	$rootScope.title = "Add Sales";
	
	$scope.buyer = {};
	$scope.product = {};
	
	$scope.buyerSelected=function(item, model){
		$scope.buyer=item;
	}
	
	$scope.productSelected=function(item, model){
		$scope.product=item;
	}
	
	baseSvc.get("buyers")
		.then(function(response){
			$scope.buyers = response.filter(function(node){
				return node.company!=null;
			});
			
			console.log($scope.buyers);
		});
	
	baseSvc.get("available/products")
		.then(function(response){
			$scope.products = response;
		});
	
	$scope.selectedProducts = [];
	
	$scope.productSelected = function(item, selectedProduct){
		$scope.selectedProducts.push(item);
	}
	
	$scope.addNewBuyer=function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/warehouseSalesEntry/addBuyerModal.html',
			controller: 'AddBuyerModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			baseSvc.post({
				buyer: item.company,
				company: item.company,
				mobile: item.mobile,
				address: item.address
			}, "warehouse/buyer/store")
				.then(function(response){
					if(response.buyer){
						$scope.buyer = response.buyer;
						$scope.buyers.push($scope.buyer);
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
	
	$scope.submitSales = function() {
		var sales = {
			buyerId: $scope.buyer.id,
			buyer: $scope.buyer.company,
			reference: $scope.reference,
			products: []
		};
		
		//console.log($scope.selectedProducts);
		$scope.selectedProducts.forEach(function(node){
			var product = {
				id: node.id,
				name: node.name,
				colors: []
			};
			node.colors.forEach(function(element){
				var color = {
					id: element.id,
					name: element.name,
					sizes: []
				};
				element.sizes.forEach(function(item){
					var size = {
						id: item.id,
						name: item.name,
						quantity: item.sellQuantity+""
					};
					color.sizes.push(size);
				});
				product.colors.push(color);
			});
			
			sales.products.push(product);
		})
		
		console.log(JSON.stringify(sales));
		
		baseSvc.post({
			sale: JSON.stringify(sales)
		}, "warehouse/sales/product/store")
			.then(function(response){
				console.log(response)
				if(response.message=='created'){
					alert("Added successfully.")
					$state.go("warehouseDashboard");
				}
				else{
					alert("Error occured.")
				}
			})
	}
});