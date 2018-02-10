myApp.controller('warehouseDashboardCtrl', function ($scope, baseSvc, $uibModal, $rootScope) {
    var token = localStorage.getItem("token");
    if(!token){
        location.href="login.html"
    }

    if ($rootScope.role != 'warehouse') {
        $rootScope.withoutPermission();
    }

    $rootScope.title = "Add Purchase";

    $scope.supplier = {};

    $scope.getCompletePurchases = function(){
        baseSvc.get("all/purchases")
        .then(function(response){
            //console.log(response);
            $scope.purchases = response;
            $scope.purchases.forEach(function(node){
                node.created_at = new Date(node.created_at);
            });
        });
    }
    $scope.getCompletePurchases();

    $scope.showPurchaseInfo = function(purchase){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/accounts/showCompletePurchase.html',
            controller: 'ViewCompletePurchaseInfoModalCtrl',
            resolve: {
                purchase: function() {
                  return purchase;
                }
              }
        });
      
        modalInstance.result.then(function (item) {
            //console.log(item);
            if(item.success==true){
                $scope.getIncompletePurchases();
                alert("Added successfully.")
            }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.getSuppliers = function(){
        baseSvc.get("suppliers")
        .then(function(response){
            console.log(response);
            $scope.suppliers = response;
            
        });
    }
    $scope.getSuppliers();

    $scope.getCategories = function(){
        baseSvc.get("categories")
        .then(function(response){
            $scope.categories = response;
        });
    }
    $scope.getCategories();

    $scope.getColors = function(){
        baseSvc.get("colors")
        .then(function(response){
            $scope.colors = response;
        });
    }

    $scope.getColors();

    $scope.getSizes = function(){
        baseSvc.get("sizes")
        .then(function(response){
            $scope.sizes = response;
        });
    }

    $scope.getSizes();

    $scope.addNewSupplier=function(){ 
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/purchase/addSupplierModal.html',
            controller: 'ModalInstanceCtrl'
        });
      
        modalInstance.result.then(function (item) {
            baseSvc.post({
                supplier: item.company,
                company: item.company,
                mobile: item.mobile,
                address: item.address
            }, "warehouse/supplier/store")
                .then(function(response){ 
                    if(response.supplier){
                        $scope.getSuppliers();
                    }
                    else if(response.status){
                        alert(response.status);
                    }
                    else{
                        alert("error occured.")
                    }
                })
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
        
    }

    $scope.addNewCategory = function(categories, product){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/purchase/addCategoryModal.html',
            controller: 'ModalInstanceCtrl'
        });
      
        modalInstance.result.then(function (item) {
            baseSvc.post({category:item.name}, "warehouse/category/store")
            .then(function(response){ 
                if(response.category){
                    $scope.getCategories();
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

    $scope.addNewSubcategory = function(category, product){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/purchase/addSubcategoryModal.html',
            controller: 'ModalInstanceCtrl'
        });
      
        modalInstance.result.then(function (item) {
            baseSvc.post({
                category_id: category.id,
                subcategory: item.name
            }, "warehouse/subcategory/store")
            .then(function(response){ 
                if(response.subcategory){
                    product.sub_category = response.subcategory;
                    category.sub_category.push(response.subcategory);
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

    $scope.addNewColor = function(){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/purchase/addColorModal.html',
            controller: 'ModalInstanceCtrl'
        });
      
        modalInstance.result.then(function (item) {
            //console.log(item);
            baseSvc.post({
                color: item.name,
                hex: item.hex
            }, "warehouse/color/store")
                .then(function(response){
                    if(response.color){
                        $scope.getColors();
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
    $scope.addNewSize = function(){
        var modalInstance = $uibModal.open({
            animation: false,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'js/templates/purchase/addSizeModal.html',
            controller: 'ModalInstanceCtrl'
        });
      
        modalInstance.result.then(function (item) {
            //console.log(sizes);
            baseSvc.post({size:item.name}, "warehouse/size/store")
            .then(function(response){ 
                if(response.size){
                    $scope.getSizes();
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


});