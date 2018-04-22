controllers

    .controller("CartCtrl", function ($http, $scope, $rootScope, orderCount, $filter, $ionicModal, $ionicPlatform, $ionicScrollDelegate, $cordovaGeolocation) {


        var options = {
            timeout: 10000,
            enableHighAccuracy: false
        };

        $scope.getTotal = function () {
            var total = 0;
            for (var i = 0; i < $rootScope.shoppingCart.length; i++) {
                var product = $rootScope.shoppingCart[i];
                total += (product.med_price * product.count);
            }
            $rootScope.total = total
            return $filter('formatPrice')(total);
        }

        $scope.removeFromCart = function (index) {
            //$($event.currentTarget).closest('.medicine-result').slideUp();
            //setTimeout(function () {
            //var index = $rootScope.cartData.indexOf(cart);
            $rootScope.shoppingCart.splice(index, 1);
            localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));

            //}, 100)
            //$(this).closest('.medicine-result').slideUp();

        }

        $scope.showMapMed = function (cart) {
            if ($scope.medMapPresent) {
                $scope.medMapPresent = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                $cordovaGeolocation
                    .getCurrentPosition(options)
                    .then(function (position) {
                        $scope.lat = position.coords.latitude
                        $scope.long = position.coords.longitude
                        // console.log('22222222222',$scope.lat);
                    }, function (err) {
                        $ionicLoading.show({
                            template: "{{'gps_off' | translate}}",
                            noBackdrop: true,
                            duration: 2000
                        });
                    });
                $scope.medMapPresent = true;
                $ionicScrollDelegate.scrollTop();
                $('.medicineMapView').addClass('medicineMapPresent');
                $scope.cartMap = cart.pharmacy_location
            }
        }

        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($('.medicineMapView').hasClass('medicineMapPresent')) {
                $scope.medMapPresent = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                navigator.app.backHistory();
            }
        }, 100);

        $scope.callFromCart = function (cart) {
            window.location.href = 'tel:' + cart.pharmacy_phone;
        }

        $scope.quantity = [{
            "val": 1
        }, {
            "val": 2
        }, {
            "val": 3
        }, {
            "val": 4
        }, {
            "val": 5
        }, {
            "val": 6
        }, {
            "val": 7
        }, {
            "val": 8
        }, {
            "val": 9
        }, {
            "val": 10
        }, {
            "val": 11
        }, {
            "val": 12
        }, {
            "val": 13
        }, {
            "val": 14
        }, {
            "val": 15
        }];

    });