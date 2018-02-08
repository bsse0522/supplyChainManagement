myApp.controller('superAdminJournalCtrl', function ($scope, baseSvc, $uibModal) {
    var token = localStorage.getItem("token");
    if (!token) {
        location.href = "login.html"
    }
    $scope.journals = [];
    $scope.showJournal = false;
    var d = new Date();
    $scope.date = new Date();
    $scope.today = "" + d.getMonth + "\/" + d.getDate() + "\/" + d.getFullYear();
    $scope.dateChanged = function (date) {
        $scope.showJournal = true;
        date = new Date(date);
        var sd = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        $scope.date = date;
        baseSvc.get("super/journal?date=" + sd)
            .then(function (response) {
                //console.log(response);
                $scope.journals = response;
                $scope.journals.forEach(function (node) {
                    node.created_at = new Date(node.created_at);
                });

                baseSvc.get("super/ledgers?date=" + sd)
                    .then(function (response) {
                        $scope.ledgers = response;
                        $scope.ledgers.forEach(function (node) {
                            node.transactions = []; 
                            node.dr = Object.keys(node.dr).map(function(k) { return node.dr[k] });                            
                            node.cr = Object.keys(node.cr).map(function(k) { return node.cr[k] });
                            if(node.cr.length>node.dr.length) {
                                for(var i=0;i<node.cr.length;i++){
                                    var transaction = {};
                                    transaction.date1 = new Date(node.cr[i].date.date);
                                    transaction.debitAccount = "To "+node.cr[i].account;
                                    transaction.debitValue = node.cr[i].value;
                                    if(node.dr.length>i){
                                        transaction.date2 = new Date(node.dr[i].date.date);
                                        transaction.creditAccount = "By "+node.dr[i].account;
                                        transaction.creditValue = node.dr[i].value;
                                    }
                                    else if(node.dr.length==i && node.cr_balance>node.dr_balance){
                                        transaction.date2 = '';
                                        transaction.creditAccount = 'Balance C/D';
                                        transaction.creditValue = node.balance;
                                    }
                                    else {
                                        transaction.date2 = '';
                                        transaction.creditAccount = '';
                                        transaction.creditValue = '';
                                    }
                                    node.transactions.push(transaction);
                                }
                                if(node.dr_balance>node.cr_balance){
                                    var transaction = {};
                                    transaction.date1 = '';
                                    transaction.creditAccount = '';
                                    transaction.creditValue = '';
                                    transaction.date2 = '';
                                    transaction.debitAccount = 'Balance C/D';
                                    transaction.debitValue = node.balance;
                                    node.transactions.push(transaction);
                                }
                            }
                            else if(node.cr.length<node.dr.length){
                                for(var i=0;i<node.dr.length;i++){
                                    var transaction = {};
                                    transaction.date2 = new Date(node.dr[i].date.date);
                                    transaction.creditAccount = "By "+node.dr[i].account;
                                    transaction.creditValue = node.dr[i].value;
                                    if(node.cr.length>i){
                                        transaction.date1 = new Date(node.cr[i].date.date);
                                        transaction.debitAccount = "To "+ node.cr[i].account;
                                        transaction.debitValue = node.cr[i].value;
                                    }
                                    else if(node.cr.length==i && node.dr_balance>node.cr_balance){
                                        transaction.date1 = '';
                                        transaction.debitAccount = 'Balance C/D';
                                        transaction.debitValue = node.balance;
                                    }
                                    else {
                                        transaction.date1 = '';
                                        transaction.debitAccount = '';
                                        transaction.debitValue = '';
                                    }
                                    node.transactions.push(transaction);
                                }
                                if(node.dr_balance<node.cr_balance){
                                    var transaction = {};
                                    transaction.date1 = '';
                                    transaction.creditAccount = 'Balance C/D';
                                    transaction.creditValue = node.balance;
                                    transaction.date2 = '';
                                    transaction.debitAccount = '';
                                    transaction.debitValue = '';
                                    node.transactions.push(transaction);
                                }
                            }
                            else {
                                for(var i=0;i<node.dr.length;i++){
                                    var transaction = {};
                                    transaction.date1 = new Date(node.dr[i].date.date);
                                    transaction.creditAccount = "By "+node.dr[i].account;
                                    transaction.creditValue = node.dr[i].value;
                                    transaction.date2 = new Date(node.cr[i].date.date);
                                    transaction.debitAccount = "To "+node.cr[i].account;
                                    transaction.debitValue = node.cr[i].value;
                                    node.transactions.push(transaction);
                                }

                                if(node.dr_balance<node.cr_balance){
                                    var transaction = {};
                                    transaction.date1 = '';
                                    transaction.creditAccount = 'Balance C/D';
                                    transaction.creditValue = node.balance;
                                    transaction.date2 = '';
                                    transaction.debitAccount = '';
                                    transaction.debitValue = '';
                                    node.transactions.push(transaction);
                                }
                                else if(node.dr_balance>node.cr_balance){
                                    var transaction = {};
                                    transaction.date1 = '';
                                    transaction.creditAccount = '';
                                    transaction.creditValue = '';
                                    transaction.date2 = '';
                                    transaction.debitAccount = 'Balance C/D';
                                    transaction.debitValue = node.balance;
                                    node.transactions.push(transaction);
                                }
                            }
                        });
                        
                        //console.log($scope.ledgers);
                    });
            });
    }

    $scope.showLedger = function (id){
        var ledger = $scope.ledgers.filter(function(node){
            return node.id == id
        });
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/journal/ledgerSingle.html',
            controller: 'SingleLedgerModalCtrl',
            resolve: {
                ledger: function() {
                  return ledger[0];
                }
              }
        });

        modalInstance.result.then(function (item) {
            console.log('Modal dismissed at: ' + new Date());
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.showAllLedgers = function (){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/journal/ledgerAll.html',
            controller: 'AllLedgersModalCtrl',
            resolve: {
                ledgers: function() {
                  return $scope.ledgers;
                }
              }
        });

        modalInstance.result.then(function (item) {
            console.log('Modal dismissed at: ' + new Date());
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.showTrialBalance = function (){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/journal/trialBalance.html',
            controller: 'TrialBalanceModalCtrl',
            resolve: {
                items: function() {
                    return {
                        date: $scope.date,
                        ledgers: $scope.ledgers
                    }
                }
              }
        });

        modalInstance.result.then(function (item) {
            console.log('Modal dismissed at: ' + new Date());
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
});


myApp.controller('SingleLedgerModalCtrl', function ($scope, $uibModalInstance, ledger) {  
    $scope.ledger = ledger;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

myApp.controller('AllLedgersModalCtrl', function ($scope, $uibModalInstance, ledgers) { 
    //console.log(ledgers);
    $scope.ledgers = ledgers;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

myApp.controller('TrialBalanceModalCtrl', function ($scope, $uibModalInstance, items) { 
    console.log(items);
    $scope.date = items.date;
    $scope.ledgers = items.ledgers;
    $scope.debit = 0;
    $scope.credit = 0;
    $scope.ledgers.forEach(function(node){
        if(node.cr_balance>node.dr_balance){
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