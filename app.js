var myApp = angular.module('accounting-soft', ['ui.router', 'ngSanitize', 'ngTable', 'ui.bootstrap', 'ui.select', 'colorpicker.module', '720kb.datepicker'])
	.value('$anchorScroll', angular.noop);

myApp.config(function ($stateProvider, $urlRouterProvider) {
	var home = {
		name: 'home',
		url: '/',
		template: 'Hello'
	}
	
	var warehousePurchase = {
		name: 'warehousePurchase',
		url: '/warehouse/purchase',
		templateUrl: 'js/templates/purchase/purchase.html',
		controller: 'purchaseCtrl'
	}
	
	var editWarehousePurchase = {
		name: 'editWarehousePurchase',
		url: '/warehouse/edit/purchase/:id',
		templateUrl: 'js/templates/purchase/editPurchase.html',
		controller: 'editPurchaseCtrl'
	}
	
	var accountsIncompletePurchase = {
		name: 'accountsIncompletePurchase',
		url: '/accounts/purchase',
		templateUrl: 'js/templates/accounts/incompletePurchase.html',
		controller: 'accountsIncompletePurchaseCtrl'
	}
	
	var accountsIncompleteSales = {
		name: 'accountsIncompleteSales',
		url: '/accounts/sales',
		templateUrl: 'js/templates/accounts/salesList.html',
		controller: 'accountsIncompleteSalesCtrl'
	}
	
	var dateWiseJournal = {
		name: 'dateWiseJournal',
		url: '/journal',
		templateUrl: 'js/templates/journal/dateWiseJournal.html',
		controller: 'superAdminJournalCtrl'
	}
	
	var dateWiseLedger = {
		name: 'dateWiseLedger',
		url: '/ledger',
		templateUrl: 'js/templates/journal/dateWiseLedger.html',
		controller: 'superAdminLedgerCtrl'
	}
	
	var superDashboard = {
		name: 'superDashboard',
		url: '/super/dashboard',
		templateUrl: 'js/templates/superDashboard/dashboard.html',
		controller: 'superAdminDashboardCtrl',
		params: {
			message: null
		}
	}
	
	var addMember = {
		name: 'addMember',
		url: '/add/member',
		templateUrl: 'js/templates/superDashboard/addMember.html',
		controller: 'addNewMemberCtrl'
	}
	
	var addLedger = {
		name: 'addLedger',
		url: '/add/Ledger',
		templateUrl: 'js/templates/superDashboard/addLedger.html',
		controller: 'addNewLedgerCtrl'
	}
	
	var warehouseDashboard = {
		name: 'warehouseDashboard',
		url: '/warehouse/dashboard',
		templateUrl: 'js/templates/warehouseDashboard/dashboard.html',
		controller: 'warehouseDashboardCtrl'
	}
	
	var warehouseSalesEntry = {
		name: 'warehouseSalesEntry',
		url: '/warehouse/salesEntry',
		templateUrl: 'js/templates/warehouseSalesEntry/warehouseSalesEntry.html',
		controller: 'warehouseSalesEntryCtrl'
	}
	
	var purchaseDetails = {
		name: 'purchaseDetails',
		url: '/warehouse/purchaseDetails/:id',
		templateUrl: 'js/templates/purchase/purchaseDetails.html',
		controller: 'purchaseDetailsCtrl'
	}
	
	var superAdminStock = {
		name: 'superAdminStock',
		url: '/super/stock',
		templateUrl: 'js/templates/superDashboard/stock.html',
		controller: 'superAdminStockCtrl'
	}
	
	var productDetails = {
		name: 'productDetails',
		url: '/product/details',
		templateUrl: 'js/templates/superDashboard/productDetails.html',
		controller: 'productDetailsCtrl'
	}
	
	// var marketing = {
	// 	name: 'marketing',
	// 	url: '/product/marketing',
	// 	templateUrl: 'js/templates/superDashboard/stock.html',
	// 	controller: 'marketingController',
	// 	controllerAs: 'marketingCtrl'
	// }
	
	var productDetailsUpdate = {
		name: 'productDetailsUpdate',
		url: '/productdetailsupdate',
		templateUrl: 'js/templates/superDashboard/productDetailsUpdate.html',
		controller: 'productDetailsUpdateController'
	}
	
	
	$stateProvider.state(warehousePurchase);
	$stateProvider.state(editWarehousePurchase);
	$stateProvider.state(accountsIncompletePurchase);
	$stateProvider.state(accountsIncompleteSales);
	$stateProvider.state(dateWiseJournal);
	$stateProvider.state(dateWiseLedger);
	$stateProvider.state(superDashboard);
	$stateProvider.state(warehouseDashboard);
	$stateProvider.state(addMember);
	$stateProvider.state(addLedger);
	$stateProvider.state(purchaseDetails);
	$stateProvider.state(warehouseSalesEntry);
	$stateProvider.state(superAdminStock);
	$stateProvider.state(productDetails);
	// $stateProvider.state(marketing);
	$stateProvider.state(productDetailsUpdate);
	
	
	
	$urlRouterProvider.otherwise('/');
});

myApp.run(function ($rootScope, $state) {
	$rootScope.role = localStorage.getItem("role");
	// $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
	//   console.log(toState);
	// })
	
	$rootScope.withoutPermission = function () {
		if ($rootScope.role) {
			if ($rootScope.role == 'super') {
				$state.go('superDashboard');
			}
			else if ($rootScope.role == 'warehouse') {
				$state.go('warehouseDashboard');
			}
			else if ($rootScope.role == 'accounts') {
				$state.go('accountsIncompletePurchase');
			}
			// else if ($rootScope.role == 'marketing') {
			//   $state.go('dateWiseJournal');
			// }
			else {
				localStorage.clear();
				window.location.href = "login.html";
			}
		}
		else {
			localStorage.clear();
			window.location.href = "login.html";
		}
	}
	
	$rootScope.logout = function () {
		localStorage.clear();
		window.location.href = "login.html";
	}
	
	if($state.current.abstract){
		$rootScope.withoutPermission();
	}
});

myApp.filter('propsFilter', function () {
	return function (items, props) {
		var out = [];
		
		if (angular.isArray(items)) {
			var keys = Object.keys(props);
			
			items.forEach(function (item) {
				var itemMatches = false;
				
				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var text = props[prop].toLowerCase();
					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						itemMatches = true;
						break;
					}
				}
				
				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			// Let the output be the input untouched
			out = items;
		}
		
		return out;
	};
});