myApp.controller('accountsIncompleteSalesCtrl', function($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role != 'accounts') {
        $rootScope.withoutPermission();
    }

    $rootScope.title = "Accounts Admin Dashboard (Sales)";

    $scope.incompleteSales = [];
    $scope.completeSales = [];

    $scope.getIncompleteSales = function(){
        baseSvc.get("incomplete/sales")
            .then(function(response){
                //console.log(response);
                $scope.incompleteSales = response;
            });
    }
    $scope.getCompleteSales = function(){
        baseSvc.get("complete/sales")
            .then(function(response){
                console.log(response);
                $scope.completeSales = response;
            });
    }

    $scope.getIncompleteSales();
    $scope.getCompleteSales();

    $scope.showCompleteSaleInfo = function(sale){
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
            // if(item.success==true){
            //     $scope.getIncompletePurchases();
            //     alert("Added successfully.")
            // }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.showIncompleteSaleInfo = function(sale){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/showIncompleteSale.html',
            controller: 'ViewIncompleteSaleInfoModalCtrl',
            resolve: {
                sale: function() {
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

    $scope.addAccountsInfo = function(sale){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/addSaleInfo.html',
            controller: 'AddSaleInfoModalInstanceCtrl',
            size: 'lg',
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
                $scope.getCompletePurchases();
                alert("Added successfully.")
            }
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
            "saleId": item.id,
            "discount": item.discount?item.discount:null,
            "products": []
          };
        item.product.forEach(function(node){
            var product={
                "id": node.id,
                "price": node.price,
                "total": node.pivot.total_amount*node.price,
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
        console.log(data);
        baseSvc.post({
            purchase: JSON.stringify(data)
        }, "accounts/sale/price/store")
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