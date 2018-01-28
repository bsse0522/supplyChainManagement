var myApp = angular.module('accounting-soft', ['ui.router', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'colorpicker.module']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  var purchase = {
    name: 'purchase',
    url: '/purchase',
    templateUrl: 'js/templates/purchase/purchase.html',
    controller: 'purchaseCtrl'
  }

  $stateProvider.state(purchase);

  $urlRouterProvider.otherwise('/purchase');
});