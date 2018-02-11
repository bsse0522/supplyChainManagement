myApp.controller('superAdminLedgerCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html"
    }
    if ($rootScope.role != 'super') {
        $rootScope.withoutPermission();
    }
    $rootScope.title = "Ledger";
    $scope.ledgers = [];
    $scope.showLedgers = false;
    $scope.showTrialBalance = false;
    var d = new Date();
    $scope.date = new Date();
    $scope.today = "" + d.getMonth + "\/" + d.getDate() + "\/" + d.getFullYear();
    $scope.showLedger = function (from, to) {
        $scope.showTrialBalance = false;
        from = new Date(from);
        to = new Date(to);
        var fd = "" + from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate();
        var td = "" + to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate();
        baseSvc.get("super/ledgers?from=" + fd + "&to=" + td)
            .then(function (response) {
                $scope.ledgers = [];
                $scope.ledgers = response;
                $scope.ledgers.forEach(function (node) {
                    node.transactions = [];
                    node.dr = Object.keys(node.dr).map(function (k) { return node.dr[k] });
                    node.cr = Object.keys(node.cr).map(function (k) { return node.cr[k] });
                    if (node.cr.length > node.dr.length) {
                        for (var i = 0; i < node.cr.length; i++) {
                            var transaction = {};
                            transaction.date1 = new Date(node.cr[i].date.date);
                            transaction.debitAccount = "To " + node.cr[i].account;
                            transaction.debitValue = node.cr[i].value;
                            if (node.dr.length > i) {
                                transaction.date2 = new Date(node.dr[i].date.date);
                                transaction.creditAccount = "By " + node.dr[i].account;
                                transaction.creditValue = node.dr[i].value;
                            }
                            else if (node.dr.length == i && node.dr_balance > node.cr_balance) {
                                transaction.date2 = '';
                                transaction.creditAccount = 'By Balance C/D';
                                transaction.creditValue = node.balance;
                            }
                            else {
                                transaction.date2 = '';
                                transaction.creditAccount = '';
                                transaction.creditValue = '';
                            }
                            node.transactions.push(transaction);
                        }
                        if (node.cr_balance > node.dr_balance) {
                            var transaction = {};
                            transaction.date1 = '';
                            transaction.creditAccount = '';
                            transaction.creditValue = '';
                            transaction.date2 = '';
                            transaction.debitAccount = 'To Balance C/D';
                            transaction.debitValue = node.balance;
                            node.transactions.push(transaction);
                        }
                    }
                    else if (node.cr.length < node.dr.length) {
                        for (var i = 0; i < node.dr.length; i++) {
                            var transaction = {};
                            transaction.date2 = new Date(node.dr[i].date.date);
                            transaction.creditAccount = "By " + node.dr[i].account;
                            transaction.creditValue = node.dr[i].value;
                            if (node.cr.length > i) {
                                transaction.date1 = new Date(node.cr[i].date.date);
                                transaction.debitAccount = "To " + node.cr[i].account;
                                transaction.debitValue = node.cr[i].value;
                            }
                            else if (node.cr.length == i && node.cr_balance > node.dr_balance) {
                                transaction.date1 = '';
                                transaction.debitAccount = 'To Balance C/D';
                                transaction.debitValue = node.balance;
                            }
                            else {
                                transaction.date1 = '';
                                transaction.debitAccount = '';
                                transaction.debitValue = '';
                            }
                            node.transactions.push(transaction);
                        }
                        if (node.cr_balance < node.dr_balance) {
                            var transaction = {};
                            transaction.date1 = '';
                            transaction.creditAccount = 'By Balance C/D';
                            transaction.creditValue = node.balance;
                            transaction.date2 = '';
                            transaction.debitAccount = '';
                            transaction.debitValue = '';
                            node.transactions.push(transaction);
                        }
                    }
                    else {
                        for (var i = 0; i < node.dr.length; i++) {
                            var transaction = {};
                            transaction.date1 = new Date(node.dr[i].date.date);
                            transaction.creditAccount = "By " + node.dr[i].account;
                            transaction.creditValue = node.dr[i].value;
                            transaction.date2 = new Date(node.cr[i].date.date);
                            transaction.debitAccount = "To " + node.cr[i].account;
                            transaction.debitValue = node.cr[i].value;
                            node.transactions.push(transaction);
                        }

                        if (node.cr_balance < node.dr_balance) {
                            var transaction = {};
                            transaction.date1 = '';
                            transaction.creditAccount = 'By Balance C/D';
                            transaction.creditValue = node.balance;
                            transaction.date2 = '';
                            transaction.debitAccount = '';
                            transaction.debitValue = '';
                            node.transactions.push(transaction);
                        }
                        else if (node.cr_balance > node.dr_balance) {
                            var transaction = {};
                            transaction.date1 = '';
                            transaction.creditAccount = '';
                            transaction.creditValue = '';
                            transaction.date2 = '';
                            transaction.debitAccount = 'To Balance C/D';
                            transaction.debitValue = node.balance;
                            node.transactions.push(transaction);
                        }
                    }
                });

                $scope.showLedgers = true;
                $scope.debit = 0;
                $scope.credit = 0;
                $scope.ledgers.forEach(function (node) {
                    if (node.cr_balance > node.dr_balance) {
                        $scope.credit += node.balance;
                    }
                    else {
                        $scope.debit += node.balance;
                    }
                });

                //console.log($scope.ledgers);
            });
    }

    // $scope.showTrialBalance = function (){
    //     var modalInstance = $uibModal.open({
    //         animation: false,
    //         ariaLabelledBy: 'modal-title',
    //         ariaDescribedBy: 'modal-body',
    //         templateUrl: 'js/templates/journal/trialBalance.html',
    //         controller: 'TrialBalanceModalCtrl',
    //         resolve: {
    //             items: function() {
    //                 return {
    //                     date: $scope.date,
    //                     ledgers: $scope.ledgers
    //                 }
    //             }
    //           }
    //     });

    //     modalInstance.result.then(function (item) {
    //         console.log('Modal dismissed at: ' + new Date());
    //     }, function () {
    //         console.log('Modal dismissed at: ' + new Date());
    //     });
    // }
});


myApp.controller('TrialBalanceModalCtrl', function ($scope, $uibModalInstance, items) {
    console.log(items);
    $scope.date = items.date;
    $scope.ledgers = items.ledgers;
    $scope.debit = 0;
    $scope.credit = 0;
    $scope.ledgers.forEach(function (node) {
        if (node.cr_balance > node.dr_balance) {
            $scope.credit += node.balance;
        }
        else {
            $scope.debit += node.balance;
        }
    });
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});