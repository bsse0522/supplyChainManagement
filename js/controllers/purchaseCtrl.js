myApp.controller('purchaseCtrl', function($scope, baseSvc, $uibModal, $rootScope, $state) {
	var token = localStorage.getItem("token");
	if(!token){
		location.href="login.html"
	}
	
	if ($rootScope.role.indexOf("warehouse_purchase_modification")==-1) {
		$rootScope.withoutPermission();
	}
	
	$rootScope.title = "Add Purchase";
	$scope.submittingPurchase = false;
	
	$scope.supplier = {};
	
	baseSvc.get("suppliers")
		.then(function(response){
			$scope.suppliers = response;
			
		});
	
	baseSvc.get("categories")
		.then(function(response){
			$scope.categories = response;
		});
	
	baseSvc.get("colors")
		.then(function(response){
			$scope.colors = response;
		});
	
	baseSvc.get("sizes")
		.then(function(response){
			$scope.sizes = response;
		});
	
	$scope.products = [];
	$scope.products.push({
		colors:[],
		pickedColors:[],
		category: {
			sub_category: []
		}
	});
	
	$scope.supplierSelected=function(item, model){
		$scope.supplier=item;
	}
	$scope.colorSelected = function(item, colors){
		colors.push({
			id: item.id,
			name: item.name,
			sizes: [],
			pickedSizes: []
		});
	}
	$scope.colorRemoved = function(item, colors){
		var removedColor = colors.filter(function(node){
			return node.id==item.id;
		})[0];
		var index = colors.indexOf(removedColor);
		colors.splice(index,1);
	}
	$scope.sizeSelected = function(item, sizes){
		sizes.push({
			id: item.id,
			name: item.name
		});
	}
	$scope.sizeRemoved = function(item, sizes){
		var removedSize = sizes.filter(function(node){
			return node.id==item.id;
		})[0];
		var index = sizes.indexOf(removedSize);
		sizes.splice(index,1);
	}
	
	$scope.addAProduct = function(){
		$scope.products.push({
			colors:[],
			pickedColors: [],
			category: {
				sub_category: []
			}
		});
	}
	
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
						$scope.supplier = response.supplier;
						$scope.suppliers.push($scope.supplier);
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
	
	$scope.addNewCategory = function(categories, product){
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
						response.category.sub_category = [];
						product.category = response.category;
						categories.push(response.category);
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
	
	$scope.addNewSubcategory = function(category, product){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/purchase/addSubcategoryModal.html',
			controller: 'ModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			baseSvc.post({
				category_id: category.id,
				subcategory: item.name
			}, "warehouse/subcategory/store")
				.then(function(response){
					if(response.subcategory){
						product.sub_category = response.subcategory;
						category.sub_category.push(response.subcategory);
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
	
	$scope.addNewColor = function(colors, pickedColors){
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
						colors.push(response.color);
						$scope.colors.push(response.color);
						$scope.colorSelected(response.color, pickedColors);
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
	$scope.addNewSize = function(sizes, pickedSizes){
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
						sizes.push(response.size);
						$scope.sizes.push(response.size);
						$scope.sizeSelected(response.size, pickedSizes);
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
	
	$scope.removeProduct = function(index){
		$scope.products.splice(index,1);
	}
	
	$scope.submitPurchase = function() {
		
		$scope.submittingPurchase = true;
		var purchase = {
			supplierId: $scope.supplier.id,
			reference: $scope.reference,
			products: []
		};
		$scope.products.forEach(function(node){
			var product = {
				name: node.name,
				category: node.category.id,
				sub_category: node.sub_category.id,
				colors: []
			};
			node.pickedColors.forEach(function(element){
				var color = {
					id: element.id,
					sizes: []
				};
				element.pickedSizes.forEach(function(item){
					var size = {
						id: item.id,
						quantity: item.quantity+""
					};
					color.sizes.push(size);
				});
				product.colors.push(color);
			});
			
			purchase.products.push(product);
		})
		
		console.log(JSON.stringify(purchase));
		
		baseSvc.post({
			purchase: JSON.stringify(purchase)
		}, "warehouse/purchase/product/store")
			.then(function(response){
				$scope.submittingPurchase = false;
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


myApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
	$scope.ok = function (item) {
		$uibModalInstance.close(item);
	};
	
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

myApp.controller('editPurchaseCtrl', function($scope, baseSvc, $uibModal, $rootScope, $state, $stateParams) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role.indexOf("warehouse_purchase_modification")==-1) {
		$rootScope.withoutPermission();
	}

    $rootScope.title = "Edit Purchase";
    $scope.submittingPurchase = false;

    $scope.supplier = {};

    $scope.products = [];

    baseSvc.get("categories")
        .then(function(response){
            $scope.categories = response;
        });
    
    baseSvc.get("colors")
        .then(function(response){
            $scope.colors = response;
        });
    
    baseSvc.get("sizes")
        .then(function(response){
            $scope.sizes = response;
        });

    baseSvc.get("warehouse/indivisual/purchase?id="+$stateParams.id)
        .then(function(response){
            var purchase = response;
            $scope.supplier = purchase.supplier;
            $scope.reference = purchase.reference;
            purchase.product.forEach(function(node) {
                var product = {
                    id: node.id,
                    name: node.name,
                    colors:node.colors,
                    pickedColors:node.colors,
                };

                $scope.categories.forEach(function(category){
                    if(category.id == node.category.id){
                        product.category = category;
                    }
                });

                product.category.sub_category.forEach(function(sub){
                    if(sub.id == node.sub_category.id){
                        product.sub_category = sub;
                    }
                });

                product.pickedColors.forEach(function(colors){
                    colors.pickedSizes = colors.sizes;
                });

                $scope.products.push(product);

            });
        });

    baseSvc.get("suppliers")
        .then(function(response){
            $scope.suppliers = response;
            
        });

    $scope.supplierSelected=function(item, model){
        $scope.supplier=item;
    }
    $scope.colorSelected = function(item, colors){
        colors.push({
            id: item.id,
            name: item.name,
            sizes: [],
            pickedSizes: []
        });
    }
    $scope.colorRemoved = function(item, colors){
        var removedColor = colors.filter(function(node){
            return node.id==item.id;
        })[0];
        var index = colors.indexOf(removedColor);
        colors.splice(index,1);
    }
    $scope.sizeSelected = function(item, sizes){
        sizes.push({
            id: item.id,
            name: item.name
        });
    }
    $scope.sizeRemoved = function(item, sizes){
        var removedSize = sizes.filter(function(node){
            return node.id==item.id;
        })[0];
        var index = sizes.indexOf(removedSize);
        sizes.splice(index,1);
    }

    $scope.addAProduct = function(){
        $scope.products.push({
            colors:[],
            pickedColors: [],
            category: {
                sub_category: []
            }
        });
    }

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
                        $scope.supplier = response.supplier;
                        $scope.suppliers.push($scope.supplier);
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

    $scope.addNewCategory = function(categories, product){
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
                    response.category.sub_category = [];           
                    product.category = response.category;
                    categories.push(response.category);
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

    $scope.addNewSubcategory = function(category, product){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/purchase/addSubcategoryModal.html',
            controller: 'ModalInstanceCtrl'
        });
      
        modalInstance.result.then(function (item) {
            baseSvc.post({
                category_id: category.id,
                subcategory: item.name
            }, "warehouse/subcategory/store")
            .then(function(response){ 
                if(response.subcategory){
                    product.sub_category = response.subcategory;
                    category.sub_category.push(response.subcategory);
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

    $scope.addNewColor = function(colors, pickedColors){
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
                        colors.push(response.color);
                        $scope.colors.push(response.color);
                        $scope.colorSelected(response.color, pickedColors);
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
    $scope.addNewSize = function(sizes, pickedSizes){
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
                    sizes.push(response.size);
                    $scope.sizes.push(response.size);
                    $scope.sizeSelected(response.size, pickedSizes);
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

    $scope.removeProduct = function(index){
        $scope.products.splice(index,1);
    }

    $scope.submitPurchase = function() {

        $scope.submittingPurchase = true;
        var purchase = {
            purchase_id: $stateParams.id,
            supplierId: $scope.supplier.id,
            reference: $scope.reference,
            products: []
        };
        $scope.products.forEach(function(node){
            var product = {
                id: node.id?node.id:null,
                name: node.name,
                category: node.category.id,
                sub_category: node.sub_category.id,
                colors: []
            };
            node.pickedColors.forEach(function(element){
                var color = {
                    id: element.id,
                    sizes: []
                };
                element.pickedSizes.forEach(function(item){
                    var size = {
                        id: item.id,
                        quantity: item.quantity+""
                    };
                    color.sizes.push(size);
                });
                product.colors.push(color);
            });

            purchase.products.push(product);
        })

        console.log(JSON.stringify(purchase));

        baseSvc.post({
            purchase: JSON.stringify(purchase)
        }, "warehouse/purchase/product/update")
            .then(function(response){
                $scope.submittingPurchase = false;
                if(response.message=='updated'){
                    alert("Updated successfully.")
                    $state.go("warehouseDashboard");
                }
                else{
                    alert("Error occured.")
                }
            })
    }
});