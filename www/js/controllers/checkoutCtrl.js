controllers
    .controller('CheckOut', function ($scope, $rootScope, orderCount, $state, $http, $ionicLoading, $ionicScrollDelegate) {
        $scope.payment_type = '3'
        $scope.del_type = '3';
        $scope.checkoutError = false;

        /* $scope.getTotal = function (del_type) {
             if (del_type == '1') {
                 $rootScope.total = $rootScope.total + 5000;
             }
             if (del_type == '2') {
                 $rootScope.total = $rootScope.total + 15000;
             }
             if (del_type == '3') {
                 $rootScope.total;
             }
         }*/

        $scope.submitPayment = function (del_type, payment_type, del_address) {

            if ((del_address == '' || del_address == undefined) && del_type != 3) {
                $scope.checkoutError = true;
                $ionicScrollDelegate.scrollTop();
            } else {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });
                var order_data = {
                    user_id: $rootScope.userInfo.user_id,
                    order: [],
                    delivery_type: del_type,
                    payment_type: payment_type,
                    address: del_address
                }
                $rootScope.shoppingCart.forEach(function (p) {
                    order_data.order.push({
                        med_id: p.med_id,
                        count: p.count,
                        pharmacy_id: p.pharmacy_id
                    })
                });

                /*console.log($.param(order_data))*/

                $http({
                    method: 'POST',
                    url: 'http://medappteka.uz/api/order',
                    data: $.param(order_data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    /*console.log(data)*/
                    $ionicLoading.hide();
                    $rootScope.orderId = data.order_id
                    $state.go('app.accepted')
                    // $rootScope.savedCart = localStorage.getItem('shoppingCart');
                    $rootScope.shoppingCart = [];
                    localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
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