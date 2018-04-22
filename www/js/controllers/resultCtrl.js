controllers

    .controller('ResultCtrl', function ($scope, $stateParams, $ionicLoading, $rootScope, $http, $ionicPopover, $ionicModal, orderCount, $filter, NgMap, $ionicPlatform, $ionicScrollDelegate, $cordovaGeolocation, $state) {

        //$scope.user.photo = null;
        /*console.log($cordovaGeolocation)*/
        $http({
            method: 'GET',
            url: 'http://medappteka.uz/api/pharmacy',
            timeout: 5000
        }).success(function (data) {
            $scope.pharmacy_list = data.data;
            //console.log($scope.pharmacy_list)
        }).error(function (err) {
            $ionicLoading.show({
                template: "{{'slow_internet' | translate}}",
                noBackdrop: true,
                duration: 2000
            });
        });

        $http({
            method: 'GET',
            url: 'http://medappteka.uz/api/pharmacy/network'
        }).success(function (data) {
           // console.log(data.data);
            $scope.pharmacy_set = data.data;
            $scope.pharmacy_set.forEach(function (p) {
                p.on = false;
            });
            $scope.itemFilter = function (med) {
                var filters = $scope.pharmacy_set.filter(function (element, idx, array) {
                    return element.on;
                }) || [];

                var matched = true;
                filters.forEach(function (option) {
                    matched = matched && med.pharmacy.name.indexOf(option.name) >= 0;
                })
                return matched;
            };
        }).error(function (err) {
            console.log(err);
        });

        $scope.priceList = [
            {
                "pr_start": 0,
                "pr_end": 10000,
                "selected": false
        },
            {
                "pr_start": 10000,
                "pr_end": 100000,
                "selected": false
        },
            {
                "pr_start": 100000,
                "pr_end": 300000,
                "selected": false
        },
            {
                "pr_start": 300000,
                "pr_end": 500000,
                "selected": false
        },
            {
                "pr_start": 500000,
                "pr_end": 150000000,
                "selected": false
        },
    ]

        $scope.priceRange = function (med) {
            var filters = $scope.priceList.filter(function (element, idx, array) {
                return element.selected;
            }) || [];

            var matched = true;
            filters.forEach(function (option) {
                matched = matched && med.price >= option.pr_start && med.price <= option.pr_end;
            })
            return matched;
        }


        /* console.log($rootScope.shoppingCart, 'Shopping Cart');*/
        //console.log($rootScope.pharmacies, 'Medicines');

        if ($rootScope.pharmacies != undefined) {
            if ($rootScope.shoppingCart) {
                $rootScope.shoppingCart.forEach(function (e) {
                    $rootScope.pharmacies.forEach(function (b) {
                        // console.log(e.med_id, 'e.id')
                        if (e.med_id == b.id) {
                            b.added_to_cart = true;
                        }
                    })
                });
            } else {
                console.log('SHOPPING CART empty');
            }
        } else {
            $state.go('app.mainPage')
        };

        /*   angular.forEach(arr1, function (value1, key1) {
               angular.forEach(arr2, function (value2, key2) {
                   if (value1.alien === value2.alien && value1.world === value2.world) {
                       // here is where you grab the value2.color
                   }
               });
           });*/


        NgMap.getMap().then(function (map) {
            $rootScope.map = map;
        });

        $scope.medMapPresent = false;
        //$scope.getLocation = function () {
        var options = {
            timeout: 1000,
            enableHighAccuracy: false
        };

        $scope.showMapMed = function (med) {
            //console.log('111111111111',$scope.lat);
            // $scope.getLocation();
            //  if ($scope.locationSuccess == true) {
            $scope.singleView = true;
            if ($scope.medMapPresent) {
                $scope.medMapPresent = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                $cordovaGeolocation
                    .getCurrentPosition(options)
                    .then(function (position) {
                        $scope.lat = position.coords.latitude
                        $scope.long = position.coords.longitude
                        //   console.log('22222222222',$scope.lat);
                    }, function (err) {
                        $ionicLoading.show({
                            template: "{{'gps_off' | translate}}",//'Местоположение отключено',
                            noBackdrop: true,
                            duration: 2000
                        });
                    });
                $ionicScrollDelegate.scrollTop();
                $scope.singlePosition = med.pharmacy.lat + ',' + med.pharmacy.lng;
                $scope.medMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
            }
            // }
        }

        $scope.showMapAll = function () {
            // $scope.getLocation();
            // if ($scope.locationSuccess == true) {
            $scope.singleView = false;
            if ($scope.medMapPresent) {
                $scope.medMapPresent = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                $cordovaGeolocation
                    .getCurrentPosition(options)
                    .then(function (position) {
                        $scope.lat = position.coords.latitude
                        $scope.long = position.coords.longitude
                    }, function (err) {
                        $ionicLoading.show({
                            template: "{{'gps_off' | translate}}",
                            noBackdrop: true,
                            duration: 2000
                        });
                    });
                //$scope.singlePosition = med.lang + ',' + med.long;
                $scope.medMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
                //console.log($scope.singlePosition);
            }
            //}
        }

        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($state.current.name == "app.MainPage") {
                navigator.app.exitApp(); //<-- remove this line to disable the exit
            }
            if ($('.medicineMapView').hasClass('medicineMapPresent')) {
                $scope.medMapPresent = false;
                $scope.singleView = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                navigator.app.backHistory();
            }
        }, 100);

        $scope.callTel = function (med) {
            window.location.href = 'tel:' + med.pharmacy.phone;
        }


        /* ========  Display Filters ============*/

        $scope.filterOpen = false; //hide filter by default
        $scope.isDisplayPharmacy = true;
        $scope.isDisplayPrice = false;
        $scope.isDisplayPlace = false;

        $scope.openFilter = function () {
            if ($scope.filterOpen) {
                $scope.filterOpen = false;
                $('.ma-filters').slideUp();
                $('.ma-results-wrapper').fadeIn(100);
            } else {
                $scope.filterOpen = true;
                $('.ma-filters').slideDown();
                $('.ma-results-wrapper').fadeOut(100);
            }
        }

        $scope.toggleFilterPharmacy = function () {
            if ($scope.isDisplayPharmacy) {
                $('.item-accordion-filter-pharmacy').slideUp();
                $scope.isDisplayPharmacy = false;
            } else {
                $('.item-accordion-filter-pharmacy').slideDown();
                $scope.isDisplayPharmacy = true;
            }
        }

        $scope.toggleFilterPrice = function () {
            if ($scope.isDisplayPrice) {
                $('.item-accordion-filter-price').slideUp();
                $scope.isDisplayPrice = false;
            } else {
                $('.item-accordion-filter-price').slideDown();
                $scope.isDisplayPrice = true;
            }
        }

        $scope.toggleFilterPlace = function () {
            if ($scope.isDisplayPlace) {
                $('.item-accordion-filter-place').slideUp();
                $scope.isDisplayPlace = false;
            } else {
                $('.item-accordion-filter-place').slideDown();
                $scope.isDisplayPlace = true;
            }
        }

        $scope.applyFilters = function () {
            $scope.filterOpen = false;
            $('.ma-filters').slideUp();
            $('.ma-results-wrapper').fadeIn(100);
        }


    })