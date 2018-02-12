controllers
    .controller('CheckOut', function ($scope, $rootScope, orderCount, $state, $http, $ionicLoading) {

        $scope.submitPayment = function () {
            $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });
            setTimeout(function () {
                $ionicLoading.hide();
                $state.go('app.accepted')
            }, 2000)
        }

        console.log($rootScope.total)
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