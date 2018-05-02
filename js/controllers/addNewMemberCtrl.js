myApp.controller('addNewMemberCtrl', function ($scope, baseSvc, $uibModal, $rootScope, $state) {
    var token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html"
    }

    if ($rootScope.role.indexOf("add_member") == -1) {
        $rootScope.withoutPermission();
    }
    $scope.submitting = false;

    $rootScope.title = "Add new member";
    baseSvc.getWithFullUrl("permissions.txt")
        .then(function (response) {
            var rolesstr = response.split('|');
            $scope.permissions = [];
            rolesstr.forEach(function (element) {
                var r = element.split(':');
                var roles = r[1].split(",");
                var permits = [];
                roles.forEach(function (node) {
                    var permission = node.replace(/_/g, ' ');
                    permission = permission.toUpperCase();
                    permits.push({
                        key: node,
                        value: permission,
                        selected: false
                    });
                });
                $scope.permissions.push({
                    type: r[0],
                    options: permits
                })
            })
            //console.log($scope.permissions)
        });
    $scope.submitUser = function (user) {
        $scope.submitting = true;
        user.role = "";
        $scope.permissions.forEach(function (roles) {
            roles.options.forEach(function(node){
                if (node.selected) {
                    user.role += node.key + ","
                }
            })
        })
        baseSvc.post(user, "super/register")
            .then(function (response) {
                //return;
                $scope.submitting = false;
                console.log(response)
                if (response.status == 'Ok') {
                    $state.go("superDashboard", { "message": "User added successfully" });
                }
                else if (response.email) {
                    alert("Email is already taken.");
                }
                else if (response.password) {
                    alert("Password must be 6 character long.");
                }
                else if (response.role) {
                    alert("Please select at least 1 role.");
                }
                else {
                    alert("Error occured");
                }
            })
    }
});


