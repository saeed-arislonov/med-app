controllers

    .controller('ResultCtrl', function ($scope, $stateParams, $ionicLoading, $rootScope, $http, $ionicPopover, $ionicModal, orderCount, $filter, NgMap, $ionicPlatform, $ionicScrollDelegate, $cordovaGeolocation, $state) {

    
    
    
        console.log($rootScope.shoppingCart, 'Shopping Cart');
        console.log($rootScope.pharmacies, 'Medicines');

    if($rootScope.pharmacies != undefined) {
        console.log("DATA EXIST")
        if ($rootScope.shoppingCart) {
            console.log('shhhhhhhhhhhhhhhhh')
            $rootScope.shoppingCart.forEach(function (e) {
                console.log(e.id, 'e.id')
                $rootScope.pharmacies.forEach(function(b){
                   // console.log(e.med_id, 'e.id')
                    console.log(b.id, 'b.id')
                        console.log('e.med_id == b.id' ,e.med_id == b.id)
                    if(e.med_id == b.id){
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


        var options = {
            enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(function (pos) {

                var posOptions = {
                    timeout: 10000,
                    enableHighAccuracy: false
                };
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude
                        var long = position.coords.longitude
                        console.log(position)
                        $scope.currentPosition = new google.maps.LatLng(lat, long);
                    }, function (err) {
                        // error
                    });
            },
            function (error) {
                alert('Unable to get location: ' + error.message);
            }, options);


        NgMap.getMap().then(function (map) {
            $rootScope.map = map;
        });

        $scope.medMapPresent = false;

        $scope.showMapMed = function (med) {
            $scope.singleView = true;
            if ($scope.medMapPresent) {
                $scope.medMapPresent = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                $ionicScrollDelegate.scrollTop();
                $scope.singlePosition = med.pharmacy.lat + ',' + med.pharmacy.lng;
                $scope.medMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
            }
        }

        $scope.showMapAll = function () {
            $scope.singleView = false;
            if ($scope.medMapPresent) {
                $scope.medMapPresent = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                //$scope.singlePosition = med.lang + ',' + med.long;
                $scope.medMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
                //console.log($scope.singlePosition);
            }
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