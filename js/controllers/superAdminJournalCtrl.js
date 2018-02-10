myApp.controller('superAdminJournalCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html"
    }
    
    if ($rootScope.role != 'super') {
        $rootScope.withoutPermission();
    }

    
    $scope.journals = [];
    var d = new Date();
    $scope.date = new Date();
    $scope.today = "" + d.getMonth + "\/" + d.getDate() + "\/" + d.getFullYear();
    $scope.dateChanged = function (date) {
        $scope.showJournal = true;
        date = new Date(date);
        var sd = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        $scope.date = date;
        baseSvc.get("super/journal?date=" + sd)
            .then(function (response) {
                //console.log(response);
                $scope.journals = response;
                $scope.journals.forEach(function (node) {
                    node.created_at = new Date(node.created_at);
                });
                showJournal(date);
            });
    }

    function showJournal(date){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/journal/journalModal.html',
            controller: 'JournalModalCtrl',
            size: 'lg',
            resolve: {
                journals: function() {
                    return $scope.journals;
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

myApp.controller('JournalModalCtrl', function ($scope, $uibModalInstance, journals) {  
    $scope.journals = journals;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});