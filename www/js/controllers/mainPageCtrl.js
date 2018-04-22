controllers
    .controller('MainPageCtrl', function ($scope, $http, $rootScope, $state, $ionicLoading, $timeout, $location, $ionicPlatform, $translate, $ionicPopup) {


        $scope.langKey = $translate.use();

        $scope.langOptions = [
            {
                key: "uz",
                value: "UZ"
            },
            {
                key: "ru",
                value: "RU"
            }
        ];

        $scope.language = 'ru'

        $scope.updateLang = function (key) {
            $translate.use(key);
        }

        console.log($state.current.name);

        $ionicPlatform.registerBackButtonAction(function () {
            //var path = $location.path()
            if ($state.current.name == 'app.mainPage') {
                $ionicPopup.confirm({
                    template: "{{'exit_app' | translate}}",
                    cancelText: 'No',
                    okText: 'Yes'
                }).then(function (res) {
                    if (res) {
                        navigator.app.exitApp();
                    }
                });

            }
        }, 100);



        var medicine_url = 'http://medappteka.uz/api/medicine/search-auto'
        $scope.fetchdata = function (data1) {
            /* console.log(data1)*/
            // condition to check for characters greater than 3.
            if (data1.length < 4) return;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            return $http({
                method: 'POST',
                url: 'http://medappteka.uz/api/medicine/search-auto',
                data: $.param({
                    query: data1
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                $scope.medicines = response.data.data;
                /*console.log($scope.medicines);*/
                $ionicLoading.hide();
                return $scope.medicines;
            }, function (err) {
                $ionicLoading.show({
                    template: "{{'slow_internet' | translate}}",
                    noBackdrop: true,
                    duration: 2000
                });
            });
        }
        /* $http({
             method: 'GET',
             url: medicine_url
         }).success(function (data) {
             $scope.medicines = data.data;
             console.log($scope.medicines)
         }).error(function (err) {
             return err;
         });*/

        $http({
            method: 'GET',
            url: 'http://medappteka.uz/api/pharmacy/districts'
        }).success(function (data) {
            $scope.districts = data.data;
            /*console.log($scope.districts)*/
        }).error(function (err) {
            $ionicLoading.show({
                template: 'Ошибка сети',
                noBackdrop: true,
                duration: 2000
            });
        });




        var specialization_url = 'http://medappteka.uz/api/inst/specializations';
        $http({
            method: 'GET',
            url: specialization_url
        }).success(function (data) {
            $scope.specializations = data.data;
            /* console.log($scope.specializations)*/
        }).error(function (err) {
            $ionicLoading.show({
                template: "{{'slow_internet' | translate}}",
                noBackdrop: true,
                duration: 2000
            });
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

        $scope.submitSearch = function (searchPlace) {
            /* console.log('searchPlace', searchPlace)*/
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            if ($scope.active == 'medicine') {
                var search_med = {
                    query: $rootScope.selectedMedicine.name
                }
                if (searchPlace == undefined || searchPlace == '') {
                    delete search_med["district_id"];
                } else {
                    /*console.log(searchPlace == undefined)*/
                    search_med["district_id"] = searchPlace.id;
                }
                $http({
                    method: 'POST',
                    url: 'http://medappteka.uz/api/medicine/search',
                    data: Object.toparams(search_med),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    if (data.data.length) {
                        /*console.log('data', data)*/
                        $rootScope.pharmacies = data.data;
                    } else {
                        $rootScope.pharmacies = [];
                    }
                    $timeout(function () {
                        $state.go('app.medicines', {}, {
                            reload: 'app.medicines'
                        });
                        $ionicLoading.hide();
                    }, 500)
                }).error(function (err, a, b, c) {
                    console.log(err, a, b, c);
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: "{{'slow_internet' | translate}}",
                        noBackdrop: true,
                        duration: 2000
                    });
                });
            } else {
                var search_cli = {
                    query: $rootScope.selectedClinic.name
                }
                if (searchPlace == undefined || searchPlace == '') {
                    delete search_cli["district_id"];
                } else {
                    search_cli["district_id"] = searchPlace.id;
                }
                $http({
                    method: 'POST',
                    url: 'http://medappteka.uz/api/inst/search-by-spec',
                    data: Object.toparams(search_cli),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    if (data.data.length) {
                        $rootScope.clinics = data.data;
                    } else {
                        $rootScope.clinics = [];
                    }
                    $rootScope.clinics = data.data;
                    $ionicLoading.hide();
                    $state.go('app.clinics');
                }).error(function (err, a, b, c) {
                    /*console.log(err, a, b, c);*/
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: "{{'slow_internet' | translate}}",
                        noBackdrop: true,
                        duration: 2000
                    });
                });
            }
        }

        //$http.get('http://medappteka.uz/api/cart').success(handleSuccess);

    })