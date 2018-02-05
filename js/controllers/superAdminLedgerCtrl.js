myApp.controller('superAdminLedgerCtrl', function($scope, baseSvc, $uibModal) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }
    $scope.ledgers = [];
    var d = new Date();
    $scope.date = new Date();
    $scope.today = ""+d.getMonth+"\/"+d.getDate()+"\/"+d.getFullYear();
    $scope.dateChanged = function(date){
        date = new Date(date);
        var sd = ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        console.log(sd);
        baseSvc.get("super/ledgers?date="+sd)
        .then(function(response){
            console.log(response);
        });
    }
    $scope.dateChanged($scope.date);
});