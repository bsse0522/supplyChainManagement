var app = angular.module('accounting-soft', []);
app.controller('loginCtrl', function($scope, $http) {
    var token = localStorage.getItem("token");
    if(token) {
        location.href = "index.html"
    }
    $scope.login = function(email, passwrod) {
        $http.post("http://soft360d.com/accountingManagement/api/login", {
            email: email,
            passwrod: passwrod
        }).then(function(response){
            if(response.api_token){
                localStorage.setItem("token",response.api_token)
            }
            else {
                
            }
        });
    }
});