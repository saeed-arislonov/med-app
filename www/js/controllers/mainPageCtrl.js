controllers
    .controller('MainPageCtrl', function ($scope, $http, $rootScope, $state, $ionicLoading, $timeout) {

        var medicine_url = 'http://medappteka.uz/api/medicine'
        $http({
            method: 'GET',
            url: medicine_url
        }).success(function (data) {
            $scope.medicines = data.data;
            console.log($scope.medicines)
        }).error(function (err) {
            return err;
        });

        var specialization_url = 'http://medappteka.uz/api/inst/specializations';
        $http({
            method: 'GET',
            url: specialization_url
        }).success(function (data) {
            $scope.specializations = data.data;
            console.log($scope.specializations)
        }).error(function (err) {
            return err;
        });
        /* $http.get('data/medicines.json').success(function (data) {
             $scope.medicines = data;
         }).error(function (err) {
             return err;
         });*/

        $scope.setMedicine = function (med) {
            $rootScope.selectedMedicine = med;
            localStorage.setItem('med_id', med);
        }

        $scope.setClinic = function (clinic) {
            $rootScope.selectedClinic = clinic;
        }

        $scope.active = 'medicine';
        $scope.productPlaceholder = 'введите название товара'
        $scope.setActive = function (type) {
            $scope.active = type;
            if (type == 'medicine') {
                $scope.productPlaceholder = ' введите название товара'
                $scope.active = 'medicine'
            } else {
                $scope.productPlaceholder = 'введите название или профиль'
                $scope.active = 'clinic';
            }
        };
        $scope.isActive = function (type) {
            return type === $scope.active;
        };

        $scope.submitSearch = function () {
            console.log($rootScope.selectedMedicine)
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            if ($scope.active == 'medicine') {
                console.log('active medicine');

                $http({
                    method: 'POST',
                    url: 'http://medappteka.uz/api/medicine/search',
                    data: Object.toparams({
                        query: $rootScope.selectedMedicine.name
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    $rootScope.pharmacies = data.data;
                    $timeout(function(){
                        $state.go('app.medicines',{},{reload: 'app.medicines'});
                    $ionicLoading.hide();
                    }, 500)
                }).error(function (err, a, b, c) {
                    console.log(err, a, b, c);
                    $ionicLoading.hide();
                });
            } else {
                $http({
                    method: 'POST',
                    url: 'http://medappteka.uz/api/inst/search-by-spec',
                    data: Object.toparams({
                        query: $rootScope.selectedClinic.name
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    console.log(data)
                    $rootScope.clinics = data.data;
                    $ionicLoading.hide();
                    $state.go('app.clinics');
                }).error(function (err, a, b, c) {
                    console.log(err, a, b, c);
                    $ionicLoading.hide();
                });
            }
        }

        //$http.get('http://medappteka.uz/api/cart').success(handleSuccess);

    })
