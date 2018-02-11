var myApp = angular.module('accounting-soft', ['ui.router', 'ngSanitize', 'ngTable', 'ui.bootstrap', 'ui.select', 'colorpicker.module', '720kb.datepicker']);

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

  var accountsIncompletePurchase = {
    name: 'accountsIncompletePurchase',
    url: '/accounts/purchase',
    templateUrl: 'js/templates/accounts/incompletePurchase.html',
    controller: 'accountsIncompletePurchaseCtrl'
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
    controller: 'superAdminDashboardCtrl'
  }

  var addMember = {
    name: 'addMember',
    url: '/add/member',
    templateUrl: 'js/templates/superDashboard/addMember.html'
  }

  var warehouseDashboard = {
    name: 'warehouseDashboard',
    url: '/warehouse/dashboard',
    templateUrl: 'js/templates/warehouseDashboard/dashboard.html',
    controller: 'warehouseDashboardCtrl'
  }

  $stateProvider.state(warehousePurchase);
  $stateProvider.state(accountsIncompletePurchase);
  $stateProvider.state(dateWiseJournal);
  $stateProvider.state(dateWiseLedger);
  $stateProvider.state(superDashboard);
  $stateProvider.state(warehouseDashboard);
  $stateProvider.state(addMember);

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