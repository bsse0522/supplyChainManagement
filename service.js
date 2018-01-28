myApp.service('baseSvc', function($http, $q) {
    var baseUrl = "http://soft360d.com/accountingManagement/api/";
    function getToken () {
        var token = localStorage.getItem("token");
        //return token;
        return "$2y$10$8U/h2vhQj/aoQMr0VpmIIeLR4Z/JQK.BEt33weq.N2okJzGtd6I6W";
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
        }).success(function(result) {
            deferred.resolve(result);
        }).error(function(result, status) {
            deferred.reject({
                error: result,
                status: status
            });
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
        }).success(function(result) {
            deferred.resolve(result);
        }).error(function(result, status) {
            deferred.reject({
                error: result,
                status: status
            });
        });
        return deferred.promise;
    }

    return {
        get : get,
        post : post
    }
});