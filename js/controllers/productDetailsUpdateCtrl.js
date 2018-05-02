myApp.controller('productDetailsUpdateController', function($rootScope,$scope, baseSvc, $state, $stateParams){
	var token = localStorage.getItem("token");
	if (!token) {
		location.href = "login.html"
	}
	if ($rootScope.role.indexOf("marketing_modification")==-1) {
		$rootScope.withoutPermission();
	}
	$rootScope.title = "Marketing";
	$scope.submitting = false;
	console.log($stateParams.id);
	$scope.getProduct = function(){
		baseSvc.get("indivisual/product?id="+$stateParams.id)
			.then(function(response){
				//$scope.product = response;
				$scope.name = response.name;
				$scope.detail = response.detail;
				$scope.images = response.images;
				$scope.doc = response.doc;
				//console.log($scope.product);
			});
	}
	$scope.getProduct();

	var formdata = new FormData();
	$scope.getTheFiles = function ($files) {
		formdata = new FormData();
		angular.forEach($files, function (value, key) {
			formdata.append("photos[]", value);
		});
	};
	// NOW UPLOAD THE FILES.
	$scope.uploadFiles = function () {
		if (confirm("Are you sure?")) {
		} else {
			return;
		}
		$scope.submitting = true;
		formdata.append("id", $stateParams.id);
		formdata.append("detail", $scope.detail);
		formdata.append("doc", $scope.newdoc);
		baseSvc.postFile(formdata, "super/store/product/details")
			.then(function(response){
				if(response=="updated"){
					alert("Updated successfully");
					$state.go("marketing");
				}
				else {
					alert("Error occured.");
				}
				$scope.submitting = false;
			})
	}

	$scope.deleteImage = function(image) {
		if (confirm("Are you sure?")) {
			baseSvc.get("delete/photo?id="+image.id)
			.then(function(response){
				var index = $scope.images.indexOf(image);
				$scope.images.splice(index, 1);
			});
		} else {
			return;
		}
	}

	$scope.removeDoc = function(image) {
		if (confirm("Are you sure?")) {
			baseSvc.get("delete/doc?id="+$stateParams.id)
			.then(function(response){
				$scope.doc = null;
			});
		} else {
			return;
		}
	}

})
