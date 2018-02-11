myApp.controller('superAdminDashboardCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html"
    }

    if ($rootScope.role != 'super') {
        $rootScope.withoutPermission();
    }

    $rootScope.title = "Super Admin Dashboard";

    $scope.suppliers = [];
    $scope.purchases = [];
    $scope.purchaseTimeRange = 'today';
    $scope.purchaseQuantity = 0;
    $scope.purchaseValue = 0;

    baseSvc.get("suppliers")
        .then(function (response) {
            $scope.suppliers = response;

        });

    $scope.purchaseTypeChanged = function (type) {
        baseSvc.get("super/timeWise/purchases?time=" + type)
            .then(function (response) {
                $scope.purchases = response;
                //console.log(response);
                $scope.purchaseQuantity = 0;
                $scope.purchaseValue = 0;
                $scope.purchases.forEach(function (purchase) {
                    purchase.created_at = new Date(purchase.created_at);
                    purchase.quantity = 0;
                    purchase.value = 0;
                    if (purchase.status != '0') {
                        purchase.product.forEach(function (product) {
                            purchase.quantity += product.stock;
                            purchase.value += (product.stock * product.purchase_unit_price);
                        });
                    }
                    $scope.purchaseQuantity += purchase.quantity;
                    $scope.purchaseValue += purchase.value;
                });
            });
    }

    $scope.purchaseTypeChanged($scope.purchaseTimeRange);

    // function showJournal(date){
    //     var modalInstance = $uibModal.open({
    //         animation: false,
    //         ariaLabelledBy: 'modal-title',
    //         ariaDescribedBy: 'modal-body',
    //         templateUrl: 'js/templates/journal/journalModal.html',
    //         controller: 'JournalModalCtrl',
    //         size: 'lg',
    //         resolve: {
    //             journals: function() {
    //                 return $scope.journals;
    //             }
    //           }
    //     });

    //     modalInstance.result.then(function (item) {
    //         console.log('Modal dismissed at: ' + new Date());
    //     }, function () {
    //         console.log('Modal dismissed at: ' + new Date());
    //     });
    // }
});

// myApp.controller('JournalModalCtrl', function ($scope, $uibModalInstance, journals) {  
//     $scope.journals = journals;
//     $scope.cancel = function () {
//         $uibModalInstance.dismiss('cancel');
//     };
// });