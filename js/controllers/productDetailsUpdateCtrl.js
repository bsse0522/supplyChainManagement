myApp.controller('productDetailsUpdateController', function($rootScope,$scope, baseSvc){
	
	// $scope.submit = function() {
	// 	if ($scope.form.file.$valid && $scope.file) {
	// 		$scope.upload($scope.file);
	// 	}
	// };
	//
	// // upload on file select or drop
	// $scope.uploadFiles = function (files) {
	// 	$scope.files = files;
	// 	if (files && files.length) {
	// 		Upload.upload({
	// 			url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
	// 			data: {
	// 				files: files
	// 			}
	// 		}).then(function (response) {
	// 			$timeout(function () {
	// 				$scope.result = response.data;
	// 			});
	// 		}, function (response) {
	// 			if (response.status > 0) {
	// 				$scope.errorMsg = response.status + ': ' + response.data;
	// 			}
	// 		}, function (evt) {
	// 			$scope.progress =
	// 				Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	// 		});
	// 	}
	// };

})/**
 * Created by mgmuntaqeem on 13/3/18.
 */
