var app = angular.module('accounting-soft', []);
app.controller('loginCtrl', function($scope, $http) {
    var token = localStorage.getItem("token");
    if(token) {
        location.href = "index.html"
    }
    $scope.error = false;
    $scope.errorMessage = '';
    $scope.login = function(email, passwrod) {
        $http.post("http://soft360d.com/accountingManagement/api/login", {
            email: email,
            password: passwrod
        }).then(function(response){
            if(response.data.status=='Ok'){
                console.log(response.data.api_token);
                localStorage.setItem("token",response.data.user.api_token);
                localStorage.setItem("role",response.data.user.role);
                location.href='index.html';
            }
            else {
                $scope.error = true;
                console.log(response);
                if(response.data.email=='Ok'){
                    $scope.errorMessage = 'Email or password is incorrect.';
                }
                else {
                    $scope.errorMessage = 'This email is not registered.';
                }
            }
        });
    }
});