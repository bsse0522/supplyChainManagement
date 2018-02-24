myApp.controller('superAdminStockCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html"
    }
    if ($rootScope.role != 'super') {
        $rootScope.withoutPermission();
    }
    $rootScope.title = "Stock";
    $scope.ledgers = [];
    $scope.showLedgers = false;
    $scope.showTrialBalance = false;
    var d = new Date();
    $scope.date = new Date();
    $scope.today = "" + d.getMonth + "\/" + d.getDate() + "\/" + d.getFullYear();

    $scope.getProducts = function(){
        baseSvc.get("available/products")
        .then(function(response){
            $scope.products = response;
            console.log($scope.products);
        });
    }
    $scope.getProducts();

    $scope.showProductDetails = function (product){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/superDashboard/productDetailsModal.html',
            controller: 'ProductDetailsModalCtrl',
            resolve: {
                item: function() {
                    return product;
                }
              }
        });

        modalInstance.result.then(function (item) {
            console.log('Modal dismissed at: ' + new Date());
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
});


myApp.controller('ProductDetailsModalCtrl', function ($scope, $uibModalInstance, item) {
    $scope.product = item;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});