myApp.controller('addNewMemberCtrl', function($scope, baseSvc, $uibModal, $rootScope, $state) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role != 'super') {
        $rootScope.withoutPermission();
    }

    $rootScope.title = "Add new member";

    $scope.submitUser = function(user){
        baseSvc.post(user, "super/register")
            .then(function(response){
                console.log(response)
                if(response.status=='Ok'){
                    $state.go("superDashboard", {"message": "User added successfully"});
                }
                else if(response.email){
                    alert("Email is already taken.");
                }
                else if(response.password){
                    alert("Password must be 6 character long.");
                }
                else {
                    alert("Error occured");
                }
            })
    }
});


