myApp.controller('warehouseSalesEntryCtrl', function($scope, baseSvc, $uibModal, $rootScope) {
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
            $scope.buyers = response;
        });

    baseSvc.get("available/products")
        .then(function(response){
            $scope.products = response;
        });

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

    $scope.submitPurchase = function() {
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


myApp.controller('AddBuyerModalInstanceCtrl', function ($scope, $uibModalInstance) {  
    $scope.ok = function (item) {
        $uibModalInstance.close(item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});