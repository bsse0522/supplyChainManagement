myApp.controller('accountsIncompletePurchaseCtrl', function($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role != 'accounts') {
        $rootScope.withoutPermission();
    }

    $scope.incompletePurchases = [];

    $scope.getIncompletePurchases = function(){
        baseSvc.get("incomplete/purchases")
        .then(function(response){
            //console.log(response);
            $scope.incompletePurchases = response;
        });
    }

    $scope.getIncompletePurchases();

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
            controller: 'ViewPurchaseInfoModalCtrl',
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
});


myApp.controller('AddInfoModalInstanceCtrl', function ($scope, $uibModalInstance, purchase, baseSvc) {  
    $scope.item = {};
    angular.copy(purchase, $scope.item);
    console.log($scope.item);
    $scope.item.product.forEach(function(node) {
        node.payment_category = "1";
        node.payment_type = "1";
        node.partial = {}
    });
    $scope.save = function (item) {
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
                }
              };
            data.products.push(product);
        });
        //console.log(data);
        baseSvc.post({
            purchase: JSON.stringify(data)
        }, "accounts/purchase/price/store")
            .then(function(response){
                //console.log(response)
                if(response.message=="created"){
                    $uibModalInstance.close({success:true});
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

myApp.controller('ViewPurchaseInfoModalCtrl', function ($scope, $uibModalInstance, purchase, baseSvc) {  
    $scope.item = purchase;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

myApp.controller('accountsCompletePurchaseCtrl', function($scope, baseSvc, $uibModal) {
    // var token = localStorage.getItem("token");
    // if(!token){
    //     location.href="login.html"
    // }
    $scope.incompletePurchases = [];

    $scope.getIncompletePurchases = function(){
        baseSvc.get("incomplete/purchases")
        .then(function(response){
            $scope.incompletePurchases = response;
        });
    }

    $scope.getIncompletePurchases();

    $scope.addAccountsInfo = function(purchase){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/addInfo.html',
            controller: 'AddInfoModalInstanceCtrl'
        });
      
        modalInstance.result.then(function (item) {
            //console.log(item);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
});