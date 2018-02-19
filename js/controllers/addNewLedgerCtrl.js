myApp.controller('addNewLedgerCtrl', function($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role != 'super') {
        $rootScope.withoutPermission();
    }

    $rootScope.title = "Add new Ledger";

    // $scope.submitUser = function(user){
    //     baseSvc.post(user, "super/register")
    //         .then(function(response){
    //             console.log(response)
    //             if(response.status=='Ok'){
    //                 alert("User added successfully.")
    //                 $state.go("superDashboard");
    //             }
    //             else if(response.email){
    //                 alert("Email is already taken.");
    //             }
    //             else if(response.password){
    //                 alert("Password must be 6 character long.");
    //             }
    //             else {
    //                 alert("Error occured");
    //             }
    //         })
    // }
});


