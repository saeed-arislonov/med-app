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
        /*$ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });*/

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

    .controller('MainPageCtrl', function ($scope, $http, $rootScope, $state, $cordovaGeolocation) {

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

        $scope.setMedicine = function (med) {
            $rootScope.selectedMedicine = med;
            localStorage.setItem('med_id', med);
        }

        $scope.setClinic = function (clinic) {
            $rootScope.selectedClinic = clinic;
        }

        $scope.active = 'medicine';
        $scope.productPlaceholder = 'вводите название продукта'
        $scope.setActive = function (type) {
            $scope.active = type;
            if (type == 'medicine') {
                $scope.productPlaceholder = ' вводите название продукта'
                $scope.active = 'medicine'
            } else {
                $scope.productPlaceholder = 'вводите название учреждения'
                $scope.active = 'clinic';
            }
        };
        $scope.isActive = function (type) {
            return type === $scope.active;
        };

        $scope.submitSearch = function () {
            if ($scope.active == 'medicine') {
                $state.go('app.medicines');
            } else {
                $state.go('app.clinics');
            }
        }
    })

    .controller('ResultCtrl', function ($scope, $stateParams, $ionicLoading, $rootScope, $http, $ionicPopover, $ionicModal, $cordovaGeolocation, orderCount, $filter) {

        var handleSuccess = function (data, status) {
            $rootScope.cartData = data;
            $rootScope.cartCount = data.length;
        }

        $scope.addToCart = function (index, med) {
            med.added_to_cart = true;
            $rootScope.cartData.push({
                "id": index + 1,
                "med_name": med.med_name,
                "manufacturer": med.manufacturer,
                "pharmacy": med.ph_name,
                "ph_image": med.ph_image,
                "address": med.address,
                "phone": med.ph_phone,
                "price": med.price,
                "cart_count": "1"
            });
        };
    
        $scope.callTel = function(med){
             window.location.href = 'tel:'+ med.ph_phone;
        }

        $scope.removeFromCart = function (index, med) {
            med.added_to_cart = false;
            $rootScope.cartData = $rootScope.cartData.filter(function (item) {
                return item.id !== parseInt(med.id);
            })
        }

        $http.get('../data/cart.json').success(handleSuccess)

        var medicine_id;

        $http.get("data/pharmacies.json" /*+ $rootScope.selectedMedicine*/ ).success(function (data) {
            $scope.medicines = data;
            console.log($scope.medicines);
            $scope.medicines.forEach(function (p) {
                p.med_name = $rootScope.selectedMedicine.name;
                p.added_to_cart = false;
            })
        }).error(function (err) {
            return err;
        });

        $ionicModal.fromTemplateUrl('templates/map.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.mapModal = modal;
        });
        $scope.openModal = function (lang, long) {
            var options = {
                timeout: 10000,
                enableHighAccuracy: true
            };

            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

                var latLng = new google.maps.LatLng(41.311335, 69.2257173);

                var mapOptions = {
                    center: latLng,
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                $scope.marker = new google.maps.Marker({
                    position: new google.maps.LatLng(41.311335, 69.2257173),
                    map: $scope.map,
                    title: 'Holas!'
                }, function (err) {
                    console.err(err);
                });
            }, function (error) {
                console.log("Could not get location");
            });
            $scope.mapModal.show();
        };
        $scope.closeModal = function () {
            $scope.mapModal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.mapModal.remove();
        });

        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.togglePharmacies = function () {
            if ($scope.isGroupShown()) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };

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

    .controller('ClinicCtrl', function ($scope, $state, $stateParams, $ionicLoading, $rootScope, $http, $ionicModal, $cordovaGeolocation, $rootScope) {

        $http.get("http://medappteka.uz/api/inst").success(function (data) {
            $scope.clinics = data.data;
            console.log($scope.clinics)
        }).error(function (err) {
            return err;
        });

        $scope.go = function (param) {
            $state.go('app.singleClinic', {
                id: param
            })
        }

        $ionicModal.fromTemplateUrl('templates/map.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.mapModal = modal;
        });
        $scope.openModal = function (lang, long) {
            var options = {
                timeout: 10000,
                enableHighAccuracy: true
            };

            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

                var latLng = new google.maps.LatLng(41.311335, 69.2257173);

                var mapOptions = {
                    center: latLng,
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                $scope.marker = new google.maps.Marker({
                    position: new google.maps.LatLng(41.311335, 69.2257173),
                    map: $scope.map,
                    title: 'Holas!'
                }, function (err) {
                    console.err(err);
                });
            }, function (error) {
                console.log("Could not get location");
            });
            $scope.mapModal.show();
        };
        $scope.closeModal = function () {
            $scope.mapModal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.mapModal.remove();
        });


    }).controller('CheckOut', function ($scope, $rootScope, orderCount, $state, $http) {

        $scope.confirming = false;
    console.log($scope.confirming)
        $scope.submitPayment = function () {
            $scope.confirming = true;
            setTimeout(function () {
                $scope.confirming = false;
                $state.go('app.accepted')
            }, 2000)
        }

        $scope.checkoutTotal = $rootScope.total;

        $scope.showPayment = true;
        $scope.showDelivery = true;
        $scope.showAddress = true;
        $scope.showInfo = true;



        $scope.toggleInfo = function () {
            if ($scope.showInfo) {
                $('.buyer-info-detail').slideUp();
                $scope.showInfo = false;
            } else {
                $('.buyer-info-detail').slideDown();
                $scope.showInfo = true;
            }
        }

        $scope.toggleAddress = function () {
            if ($scope.showAddress) {
                $('.buyer-info-detail-address').slideUp();
                $scope.showAddress = false;
            } else {
                $('.buyer-info-detail-address').slideDown();
                $scope.showAddress = true;
            }
        }

        $scope.toggleDelivery = function () {
            if ($scope.showDelivery) {
                $('.buyer-info-detail-delivery').slideUp();
                $scope.showDelivery = false;
            } else {
                $('.buyer-info-detail-delivery').slideDown();
                $scope.showDelivery = true;
            }
        }
        $scope.togglePayment = function () {
            if ($scope.showPayment) {
                $('.buyer-info-payment').slideUp();
                $scope.showPayment = false;
            } else {
                $('.buyer-info-payment').slideDown();
                $scope.showPayment = true;
            }
        }

        /* $('.del-checkboxes').children().children().click(function(){
             console.log(this);
             $('.del-checkboxes input').not(this).prop('checked', false);  
            // $('.del-checkboxes').children().find('input').attr('checked', false);
             //$(this).find('input').attr('checked', true);
         })*/
    })
    .controller("CartCtrl", function ($http, $scope, $rootScope, orderCount) {
        if ($rootScope.cartData == undefined) {
            $http.get('../data/cart.json').success(function (data, status) {
                $rootScope.cartData = data;
                $rootScope.cartCount = data.length;
                $scope.getTotal = function () {
                    var total = 0;
                    for (var i = 0; i < $rootScope.cartData.length; i++) {
                        var product = $rootScope.cartData[i];
                        total += (product.price * product.cart_count);
                    }
                    orderCount.total = total
                    return total;
                }
            })
        } else {
            $scope.getTotal = function () {
                var total = 0;
                for (var i = 0; i < $rootScope.cartData.length; i++) {
                    var product = $rootScope.cartData[i];
                    total += (product.price * product.cart_count);
                }
                $rootScope.total = total
                return total;
            }
        }

        $scope.removeFromCart = function (cart) {
            var index = $rootScope.cartData.indexOf(cart);
            $rootScope.cartData.splice(index, 1);
        }
        
        $scope.callFromCart = function(cart){
            window.location.href = 'tel:'+ cart.phone;
        }
    });