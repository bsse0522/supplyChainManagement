var myApp = angular.module('accounting-soft', ['ui.router', 'ngResource', 'textAngular', 'smart-table', 'ngSanitize', 'ui.bootstrap', 'ui.utils', 'ui.select', 'colorpicker.module', '720kb.datepicker'])
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

	var warehouseSalesEdit = {
		name: 'warehouseSalesEdit',
		url: '/warehouse/salesEdit/:id',
		templateUrl: 'js/templates/warehouseSalesEntry/warehouseSalesEdit.html',
		controller: 'warehouseSalesEditCtrl'
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
	var marketing = {
		name: 'marketing',
		url: '/marketing',
		templateUrl: 'js/templates/superDashboard/marketing.html',
		controller: 'marketingCtrl'
	}

	var productDetails = {
		name: 'productDetails',
		url: '/product/details',
		templateUrl: 'js/templates/superDashboard/productDetails.html',
		controller: 'productDetailsCtrl'
	}

	var productDetailsUpdate = {
		name: 'productDetailsUpdate',
		url: '/productdetailsupdate/:id',
		templateUrl: 'js/templates/superDashboard/productDetailsUpdate.html',
		controller: 'productDetailsUpdateController',
		controllerAs: 'pduCtrl'
	}

	var profitLoss = {
		name: 'profitLoss',
		url: '/profitLoss',
		templateUrl: 'js/templates/profitLoss/profitLoss.html',
		controller: 'profitLossCtrl',
	}

	var noPermission = {
		name: 'noPermission',
		url: '/no-permission',
		templateUrl: 'js/templates/profitLoss/noPermission.html',
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
	$stateProvider.state(warehouseSalesEdit);
	$stateProvider.state(superAdminStock);
	$stateProvider.state(productDetails);
	$stateProvider.state(marketing);
	$stateProvider.state(productDetailsUpdate);
	$stateProvider.state(profitLoss);
	$stateProvider.state(noPermission);


	$urlRouterProvider.otherwise('/');
});

myApp.run(function ($rootScope, $state) {
	$rootScope.logout = function () {
		localStorage.clear();
		window.location.href = "login.html";
	}
	$rootScope.role = localStorage.getItem("role");
	if(!$rootScope.role){
		$rootScope.logout();
	}
	$rootScope.loggedInUser = JSON.parse(localStorage.getItem("user"));
	$rootScope.warehouseDashboardPermission = false;
	$rootScope.superDashboardPermission = false;

	$rootScope.checkPermissions = function () {
		if ($rootScope.role.indexOf('supplier_info_dashboard') != -1 || $rootScope.role.indexOf('buyer_info_dashboard') != -1 || $rootScope.role.indexOf('purchase_summary_dashboard') != -1 || $rootScope.role.indexOf('sale_summary_dashboard') != -1) {
			$rootScope.superDashboardPermission = true;
			$state.go('superDashboard');
			if ($rootScope.role.indexOf('supplier_view') != -1 || $rootScope.role.indexOf('buyer_view') != -1 || $rootScope.role.indexOf('color_view') != -1 || $rootScope.role.indexOf('size_view') != -1 ||
				$rootScope.role.indexOf('category_view') != -1 || $rootScope.role.indexOf('warehouse_purchase_view') != -1 || $rootScope.role.indexOf('warehouse_sale_view') != -1) {
				$rootScope.warehouseDashboardPermission = true;
			}
		}
		else if ($rootScope.role.indexOf('supplier_view') != -1 || $rootScope.role.indexOf('buyer_view') != -1 || $rootScope.role.indexOf('color_view') != -1 || $rootScope.role.indexOf('size_view') != -1 ||
			$rootScope.role.indexOf('category_view') != -1 || $rootScope.role.indexOf('warehouse_purchase_view') != -1 || $rootScope.role.indexOf('warehouse_sale_view') != -1) {
			$rootScope.warehouseDashboardPermission = true;
			$state.go('warehouseDashboard');
		}
		else if ($rootScope.role.indexOf('marketing_view') != -1) {
			$state.go('marketing');
		}
		else if ($rootScope.role.indexOf('accounts_purchase_view') != -1) {
			$state.go('accountsIncompletePurchase');
		}
		else if ($rootScope.role.indexOf('accounts_sale_view') != -1) {
			$state.go('accountsIncompleteSales');
		}
		else if ($rootScope.role.indexOf('add_ledger') != -1) {
			$state.go('addLedger');
		}
		else if ($rootScope.role.indexOf('add_member') != -1) {
			$state.go('addMember');
		}
		else if ($rootScope.role.indexOf('journal') != -1) {
			$state.go('dateWiseJournal');
		}
		else if ($rootScope.role.indexOf('ledger') != -1) {
			$state.go('dateWiseLedger');
		}
		else if ($rootScope.role.indexOf('stock') != -1) {
			$state.go('superAdminStock');
		}
		else if ($rootScope.role.indexOf('profit_loss') != -1) {
			$state.go('profit_loss');
		}
		else {
			$rootScope.title = "No permission"
			$state.go('noPermission');
		}
	}

	if ($state.current.abstract) {
		$rootScope.checkPermissions();
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

myApp.directive('ngFiles', ['$parse', function ($parse) {
	function fn_link(scope, element, attrs) {
		var onChange = $parse(attrs.ngFiles);
		element.on('change', function (event) {
			onChange(scope, { $files: event.target.files });
		});
	};
	return {
		link: fn_link
	}
}]);

myApp.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

myApp.directive('stringToNumber', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function (value) {
				return '' + value;
			});
			ngModel.$formatters.push(function (value) {
				return parseFloat(value);
			});
		}
	};
});

myApp.directive('myTable', function () {
	return {
		restrict: 'E, A, C',
		link: function (scope, element, attrs, controller) {
			var dataTable = element.dataTable(scope.options);

			scope.$watch('options.aaData', handleModelUpdates, true);

			function handleModelUpdates(newData) {
				var data = newData || null;
				if (data) {
					dataTable.fnClearTable();
					dataTable.fnAddData(data);
				}
			}
		},
		scope: {
			options: "="
		}
	};
});