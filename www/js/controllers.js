angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('MainPageCtrl', function ($scope, $http, $rootScope, $state) {
       /* var medicine_url = 'data/medicines.json'
        $http({
            method: 'GET',
            url: medicine_url
        }).success(function (data) {
            $scope.medicines = data.data;
            console.log($scope.medicines)
        }).error(function (err) {
            return err;
        });*/
    $http.get('data/medicines.json').success(function (data) {
            $scope.medicines = data;
            console.log($scope.medicines)
        }).error(function (err) {
            return err;
        });

     $scope.setMedicine = function(med){
         $rootScope.selectedMedicine = med;
         localStorage.setItem('med_id', med);
     }
     
     $scope.setClinic = function(clinic){
         $rootScope.selectedClinic = clinic;
     }
    
        $scope.active = 'medicine';
        $scope.productPlaceholder = 'Nazvaniya lekartsvo'
        $scope.setActive = function (type) {
            $scope.active = type;
            if(type == 'medicine') {
                $scope.productPlaceholder = 'Nazvaniya lekartsvo'
            } else {
                 $scope.productPlaceholder = 'Nazvaniya ucherejdeniya'
            }
        };
        $scope.isActive = function (type) {
            return type === $scope.active;
        };
    
    $scope.submitSearch = function(){
        if($scope.active == 'medicine') {
            $state.go('app.medicines');
        } else {
            $state.go('app.clinics');
        }
    }

    })

    .controller('ResultCtrl', function ($scope, $stateParams, $ionicLoading, $rootScope, $http) {

        var medicine_id;
        
        $http.get("http://medappteka.uz/api/medicine/view?id=" + $rootScope.selectedMedicine).success(function (data) {
            $scope.medicines = data;
            console.log($scope.medicines)
        }).error(function (err) {
            return err;
        });
    
    $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
    

    })
    
    .controller('ClinicCtrl', function ($scope, $state, $stateParams, $ionicLoading, $rootScope, $http) {

         $http.get("http://medappteka.uz/api/inst").success(function (data) {
            $scope.clinics = data.data;
            console.log($scope.clinics)
        }).error(function (err) {
            return err;
        });
    
        $scope.go = function(param){
            $state.go('app.singleClinic', {id: param})
        }

    });