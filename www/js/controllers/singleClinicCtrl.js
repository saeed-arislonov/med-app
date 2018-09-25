controllers
    .controller('singleClinicCtrl', function ($stateParams, $scope, $http, orderCount, $ionicModal, $ionicPopup, IonicClosePopupService, NgMap, $rootScope, $state, singleMap, $ionicScrollDelegate, $cordovaGeolocation, $ionicLoading) {

  $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
  
        $http.get("http://medappteka.uz/api/inst/view?id=" + $stateParams.id).success(function (data) {
            $scope.singleClinic = data;
            console.log($scope.singleClinic);
          $ionicLoading.hide();
        }).error(function (err) {
          $ionicLoading.hide();
            $ionicLoading.show({
                template: "{{'slow_internet' | translate}}",
                noBackdrop: true,
                duration: 2000
            });
        });

        $scope.callClinic = function (cli) {
            window.location.href = 'tel:' + cli;
         // console.log(cli)
        }

        var d = new Date();
        $scope.todaysDate = d.getDate();
        $scope.todaysMonth = d.getMonth() + 1;

        var options = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $scope.cliMapPresent = false;
        $scope.showMapMed = function (cli) {
            if ($scope.cliMapPresent) {
               // console.log('true')
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
                //console.log('false')
                $scope.singlePosition = cli.lat + ',' + cli.lng;
                $scope.cliMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
            }
        }




        NgMap.getMap().then(function (map) {
            $rootScope.map = map;
        });

        $scope.showPopup = function () {
            //$scope.data = {}

            // Custom popup
            var contactsPopup = $ionicPopup.show({
                template: '<div style="text-align:center;padding-bottom:10px;border-bottom:1px solid #eee" ng-click="callClinic(singleClinic.contacts)">' +
                    '{{singleClinic.contacts}}</div>' +
                    '<div ng-if="singleClinic.contacts_two" style="text-align:center;padding-bottom:10px;padding-top:10px;border-bottom:1px solid #eee" ng-click="callClinic(singleClinic.contacts_two)">{{singleClinic.contacts_two}}</div>' +
                    '<div ng-if="singleClinic.contacts_third" style="text-align:center;padding-bottom:10px;padding-top:10px;border-bottom:1px solid #eee" ng-click="callClinic(singleClinic.contacts_third)">{{singleClinic.contacts_third}}</div>',
                title: 'Bсе контакты',
                scope: $scope,
                backdropClickToClose: true
            });

            IonicClosePopupService.register(contactsPopup);

        };
    })