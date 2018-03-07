myApp.controller('purchaseDetailsCtrl', function($scope, baseSvc, $uibModal, $rootScope, $stateParams) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role != 'warehouse') {
        $rootScope.withoutPermission();
    }

    $rootScope.title = "Purchase Details";

    baseSvc.get("warehouse/purchaseWiseReport?id="+$stateParams.id)
        .then(function(response){
            console.log(response);
            $scope.purchase = response.purchase;
            $scope.purchase.created_at = new Date($scope.purchase.created_at.date);
            $scope.sales = response.sales;
        });
});


