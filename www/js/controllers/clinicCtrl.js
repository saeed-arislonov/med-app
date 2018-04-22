controllers

    .controller('ClinicCtrl', function ($scope, $state, $stateParams, $ionicLoading, $rootScope, $http, $ionicModal, $rootScope, $ionicPlatform, $ionicScrollDelegate, $cordovaGeolocation) {

        /*$scope.clinicLoading = true;
        $http.get("http://medappteka.uz/api/inst").success(function (data) {
        	$scope.clinics = data.data;
        	console.log($scope.clinics);
        	$scope.clinicLoading = false;
        }).error(function (err) {
        	return err;
        });*/

        var options = {
            timeout: 10000,
            enableHighAccuracy: false
        };

        $scope.go = function (param) {
            $state.go('app.singleClinic', {
                id: param
            })
        }

        $scope.callClinic = function (cli) {
            window.location.href = 'tel:' + cli.contacts;
        }

        $scope.filterOpen = false;
        $scope.isDisplayPharmacy = true;
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


        $scope.cliMapPresent = false;

        $scope.showMapMed = function (cli) {
            $scope.singleView = true;
            if ($scope.cliMapPresent) {
                $scope.cliMapPresent = false;
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
                $ionicScrollDelegate.scrollTop();
                $scope.singlePosition = cli.lat + ',' + cli.lng;
                $scope.cliMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
            }
        }

        $scope.showMapAll = function () {
            $scope.singleView = false;
            if ($scope.cliMapPresent) {
                $scope.cliMapPresent = false;
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
                $scope.cliMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
                //console.log($scope.singlePosition);
            }
        }

        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($('.medicineMapView').hasClass('medicineMapPresent')) {
                $scope.medMapPresent = false;
                $scope.singleView = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                navigator.app.backHistory();
            }
        }, 100);

    })