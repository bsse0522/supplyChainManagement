myApp.controller('addNewLedgerCtrl', function($scope, baseSvc, $uibModal, $rootScope, $state) {
	var token = localStorage.getItem("token");
	if(!token){
		location.href="login.html"
	}
	
	if ($rootScope.role != 'super') {
		$rootScope.withoutPermission();
	}
	
	$scope.ledger = {
		opening_balance_type: 'Dr',
		opening_balance: 0,
		other: ''
	};
	
	baseSvc.get("ledger/groups")
		.then(function(response){
			$scope.groups = response;
		});
	
	$rootScope.title = "Add new Ledger";
	
	
	$scope.addNewGroup = function(){
		var modalInstance = $uibModal.open({
			animation: false,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'js/templates/superDashboard/addGroupModal.html',
			controller: 'ModalInstanceCtrl'
		});
		
		modalInstance.result.then(function (item) {
			//console.log(item);
			baseSvc.post({
				name: item.name
			}, "super/ledger/add/groups")
				.then(function(response){
					if(response.name){
						$scope.groups.push(response);
						$scope.ledger.ledger_category = response;
					}
					else if(response.status){
						alert(response.status);
					}
					else {
						alert("Error occured");
					}
				})
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.submit = function(ledger){
		//console.log(ledger);
		ledger.ledger_category = ledger.ledger_category.id;
		baseSvc.post(ledger, "super/store/ledger")
			.then(function(response){
				console.log(response)
				if(response.message=='created'){
					$state.go("superDashboard", {'message': 'Ledger added successfully.'});
				}
				else {
					alert("Error occured");
				}
			})
	}
});


