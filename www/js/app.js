// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'ngTouch', 'ui.bootstrap', 'ngCordova', 'starter.factories'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        //$ionicConfigProvider.views.transition('none')
        // rest of the config    
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.medicines', {
                url: '/medicines',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/medicines.html',
                        controller: 'ResultCtrl'
                    }
                }
                /*,
                               resolve: {
                                   resolvedData: function ($http, $rootScope) {
                                       var url = "http://medappteka.uz/api/medicine/view?id=" + $rootScope.selectedMedicines;
                                       
                                       var result = $http({
                                           method: 'GET',
                                           url: url
                                       }).success(function (data) {
                                           return data;
                                       }).error(function (err) {
                                           return err;
                                       });
                                       return result;
                                   }
                               } */
            })

            .state('app.myCart', {
                url: '/my-cart',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/cart.html',
                        controller: 'CartCtrl'
                    }
                }
            })
            .state('app.checkout', {
                url: '/checkout',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/checkout.html',
                        controller: 'CheckOut'
                    }
                }
            })
            .state('app.accepted', {
                url: '/accepted',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/accepted.html',
                        controller: function () {}
                    }
                }
            })
            .state('app.profile', {
                url: '/menu',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: function (orderCount, $rootScope) {

                        }
                    }
                }
            })
            .state('app.orders', {
                url: '/orders',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/orders.html',
                        controller: function (orderCount, $rootScope) {

                        }
                    }
                }
            })
            .state('app.mainPage', {
                url: '/mainPage',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/mainPage.html',
                        controller: 'MainPageCtrl'
                    }
                }
            })
            .state('app.clinics', {
                url: '/clinics',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/clinics.html',
                        controller: 'ClinicCtrl'
                    }
                }
            })

            .state('app.singleClinic', {
                url: '/clinics/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlist.html',
                        controller: function ($stateParams, $scope, $http, orderCount, $ionicModal, $cordovaGeolocation) {
                            $http.get("http://medappteka.uz/api/inst/view?id=" + $stateParams.id).success(function (data) {
                                $scope.singleClinic = data;
                                console.log($scope.singleClinic)
                            }).error(function (err) {
                                return err;
                            });
                            
                            $scope.callTel = function(cli){
                                console.log(cli)
                                window.location.href = 'tel:'+ cli.contacts;
                            }

                            var d = new Date();
                            $scope.todaysDate = d.getDate();
                            $scope.todaysMonth = d.getMonth() + 1;

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

                        }
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/mainPage');
    });