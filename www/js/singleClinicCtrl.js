controllers
    .controller('singleClinicCtrl', function ($stateParams, $scope, $http, orderCount, $ionicModal, $ionicPopup, IonicClosePopupService, NgMap, $rootScope, $state, singleMap, $ionicScrollDelegate) {

        $http.get("http://medappteka.uz/api/inst/view?id=" + $stateParams.id).success(function (data) {
            $scope.singleClinic = data;
            console.log($scope.singleClinic)
        }).error(function (err) {
            return err;
        });

        $scope.callClinic = function (cli) {
            window.location.href = 'tel:' + cli.contacts;
        }

        var d = new Date();
        $scope.todaysDate = d.getDate();
        $scope.todaysMonth = d.getMonth() + 1;

        
    $scope.cliMapPresent = false;
    $scope.showMapMed = function (cli) {
            if ($scope.cliMapPresent) {
                console.log('true')
                $scope.cliMapPresent = false;
                $('.medicineMapView').removeClass('medicineMapPresent');
            } else {
                $ionicScrollDelegate.scrollTop();
                console.log('false')
                $scope.singlePosition = cli.lat + ',' + cli.lng;
                $scope.cliMapPresent = true;
                $('.medicineMapView').addClass('medicineMapPresent');
            }
        }

    NgMap.getMap().then(function(map) {
          $rootScope.map = map;
        });

        $scope.showPopup = function () {
            //$scope.data = {}

            // Custom popup
            var contactsPopup = $ionicPopup.show({
                template: '<div style="text-align:center" ng-click="callClinic(singleClinic)">' +
                    '{{singleClinic.contacts}}</div>',
                title: 'Bсе контакты',
                scope: $scope,
                backdropClickToClose: true
            });

            IonicClosePopupService.register(contactsPopup);

        };
    })