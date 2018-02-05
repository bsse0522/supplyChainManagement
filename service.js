myApp.service('baseSvc', function($http, $q) {
    var baseUrl = "http://soft360d.com/accountingManagement/api/";
    function getToken () {
        var token = localStorage.getItem('token');
        //console.log(token);
        return token;
    }

    function get(endPoint) {
        var deferred = $q.defer();
        $http({
            url: baseUrl + endPoint,
            method: "GET",
            headers: {
                "api-token": getToken(),
                "content-Type": "application/json"
            }
        }).then(function(success) {
            deferred.resolve(success.data);
        }, function(error) {
            deferred.reject({
                error: error
            });
            if(error.status==401 || error.status==403){
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                location.href = 'login.html';
            }
        });
        return deferred.promise;
    }

    function post(data, endPoint) {
        var deferred = $q.defer();
        $http({
            url: baseUrl + endPoint,
            method: "POST",
            headers: {
                "api-token": getToken(),
                "content-Type": "application/json"
            },
            data: JSON.stringify(data)
        }).then(function(success) {
            deferred.resolve(success.data);
        }, function(error) {
            deferred.reject({
                error: error
            });
            if(error.status==401 || error.status==403){
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                location.href = 'login.html';
            }
        });
        return deferred.promise;
    }

    return {
        get : get,
        post : post
    }
});