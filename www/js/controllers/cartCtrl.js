controllers

    .controller("CartCtrl", function ($http, $scope, $rootScope, orderCount, $filter, $ionicModal, $ionicPlatform, $ionicScrollDelegate) {
        
    
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
            window.location.href = 'tel:' + cart.pharmacy.contacts;
        }

    });