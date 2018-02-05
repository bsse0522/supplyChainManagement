myApp.controller('superAdminJournalCtrl', function($scope, baseSvc, $uibModal) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }
    $scope.journals = [];
    var d = new Date();
    $scope.date = new Date();
    $scope.today = ""+d.getMonth+"\/"+d.getDate()+"\/"+d.getFullYear();
    $scope.dateChanged = function(date){
        date = new Date(date);
        var sd = ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        //console.log(sd);
        baseSvc.get("super/journal?date="+sd)
        .then(function(response){
            //console.log(response);
            $scope.journals = response;
            $scope.journals.forEach(function(node){
                node.created_at = new Date(node.created_at);
            });
        });
    }
    $scope.dateChanged($scope.date);
});