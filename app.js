var myApp = angular.module('accounting-soft', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'colorpicker.module', '720kb.datepicker']);

myApp.config(function ($stateProvider, $urlRouterProvider) {
  var warehousePurchase = {
    name: 'warehousePurchase',
    url: '/warehouse/purchase',
    templateUrl: 'js/templates/purchase/purchase.html',
    controller: 'purchaseCtrl'
  }

  var accountsIncompletePurchase = {
    name: 'accountsIncompletePurchase',
    url: '/accounts/incomplete/purchase',
    templateUrl: 'js/templates/accounts/incompletePurchase.html',
    controller: 'accountsIncompletePurchaseCtrl'
  }

  var dateWiseJournal = {
    name: 'dateWiseJournal',
    url: '/journal',
    templateUrl: 'js/templates/journal/dateWiseJournal.html',
    controller: 'superAdminJournalCtrl'
  }

  $stateProvider.state(warehousePurchase);
  $stateProvider.state(accountsIncompletePurchase);
  $stateProvider.state(dateWiseJournal);

  $urlRouterProvider.otherwise('/journal');
});

myApp.run(function($rootScope){
  $rootScope.role = localStorage.getItem("role");
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