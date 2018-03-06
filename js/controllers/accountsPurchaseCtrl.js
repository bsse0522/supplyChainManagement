myApp.controller('accountsIncompletePurchaseCtrl', function($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role != 'accounts') {
        $rootScope.withoutPermission();
    }

    $rootScope.title = "Accounts Admin Dashboard (Purchases)";

    $scope.incompletePurchases = [];

    $scope.getIncompletePurchases = function(){
        baseSvc.get("incomplete/purchases")
            .then(function(response){
                //console.log(response);
                $scope.incompletePurchases = response;
            });
    }
    $scope.getCompletePurchases = function(){
        baseSvc.get("complete/purchases")
            .then(function(response){
                console.log(response);
                $scope.completePurchases = response;
            });
    }

    $scope.getIncompletePurchases();
    $scope.getCompletePurchases();

    $scope.addAccountsInfo = function(purchase){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/addInfo.html',
            controller: 'AddInfoModalInstanceCtrl',
            size: 'lg',
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
                $scope.getCompletePurchases();
                alert("Added successfully.")
            }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.showPurchaseInfo = function(purchase){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/showIncompletePurchase.html',
            controller: 'ViewIncompletePurchaseInfoModalCtrl',
            resolve: {
                purchase: function() {
                  return purchase;
                }
              }
        });
      
        modalInstance.result.then(function (item) {
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.showCompletePurchaseInfo = function(purchase){
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
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
});


myApp.controller('AddInfoModalInstanceCtrl', function ($scope, $uibModalInstance, purchase, baseSvc) {  
    $scope.item = {};
    $scope.addingInfo = false;
    angular.copy(purchase, $scope.item);
    //console.log($scope.item);

    $scope.item.product.forEach(function(node) {
        node.payment_category = "1";
        node.payment_type = "1";
        node.partial = {}
    });

    $scope.getLedgers = function(){
        baseSvc.get("ledgers/list")
        .then(function(response){
            //console.log(response);
            $scope.ledgers = response;
        });
    }
    $scope.getLedgers();

    $scope.save = function (item) {
        $scope.addingInfo = true;
        var data = {
            "purchaseId": item.id,
            "transport": item.transport?item.transport:null,
            "labour": item.labour?item.labour:null,
            "vat": item.vat==1?1:null,
            "discount": item.discount?item.discount:null,
            "others": item.other?item.other:null,
            "products": []
          };
        item.product.forEach(function(node){
            var product={
                "id": node.id,
                "price": node.price,
                "total": node.stock*node.price,
                "payment_category": node.payment_category,
                "payment_type": node.payment_type,
                "partial": {
                  "cash": node.partial.cash?node.partial.cash:null,
                  "check": node.partial.check?node.partial.check:null
                },
                "check": node.check?node.check.name: null
              };
            data.products.push(product);
        });
        //console.log(data);
        baseSvc.post({
            purchase: JSON.stringify(data)
        }, "accounts/purchase/price/store")
            .then(function(response){
                $scope.addingInfo = false;
                if(response.message=="created"){
                    $uibModalInstance.close(purchase);
                }
                else{
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

    $scope.showProductDetails = function(product){
        localStorage.setItem("product", JSON.stringify(product));
        var url = $state.href('productDetails');
        window.open(url,'_blank');
    }
});

myApp.controller('ViewCompletePurchaseInfoModalCtrl', function ($scope, $uibModalInstance, purchase, baseSvc, $state) {  
    $scope.item = purchase;
    $scope.item.created_at = new Date($scope.item.created_at);
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.showProductDetails = function(product){
        localStorage.setItem("product", JSON.stringify(product));
        var url = $state.href('productDetails');
        window.open(url,'_blank');
    }
});