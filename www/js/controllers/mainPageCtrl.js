controllers
    .controller('MainPageCtrl', function ($scope, $http, $rootScope, $state, $ionicLoading, $timeout, $location, $ionicPlatform, $translate, $ionicPopup, $cordovaGeolocation) {

        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        $cordovaGeolocation
            .getCurrentPosition(options)
            .then(function (position) {
                $scope.lat = position.coords.latitude
                $scope.long = position.coords.longitude
                console.log('22222222222', $scope.lat);
            }, function (err) {
                console.log(err)
                console.log('NO MAP')
                $ionicLoading.show({
                    template: "{{'gps_off' | translate}}", //'Местоположение отключено',
                    noBackdrop: true,
                    duration: 2000
                });
            });


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

    $scope.data = {};
  $scope.data.bgColors = [];
  $scope.data.currentPage = 0;

         var setupSlider = function() {
    //some options to pass to our slider
    $scope.data.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300 //0.3s transition
    };

    //create delegate reference to link with slider
    $scope.data.sliderDelegate = null;

    //watch our sliderDelegate reference, and use it when it becomes available
    $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
      if (newVal != null) {
        $scope.data.sliderDelegate.on('slideChangeEnd', function() {
          $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
          //use $scope.$apply() to refresh any content external to the slider
          $scope.$apply();
        });
      }
    });
  };

  


        $scope.gettingBanners = true;
        $http({
            method: 'GET',
            url: 'http://medappteka.uz/api/banner'
        }).success(function (data) {
            $scope.banners = data.data;
            console.log($scope.banners);
            $scope.gettingBanners = false;
            $timeout(function () {
                
                setupSlider();
               // $(".banners-getting").css('opacity', '1')
            }, 1000)

        }).error(function (err) {
            $scope.gettingBanners = false;
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