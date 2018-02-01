// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'ngTouch', 'ui.bootstrap', 'starter.factories', 'starter.filters', 'ngMap', 'ngFileUpload'])

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
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('firstTimeUser', {
                url: '/firstTimeUser',
                templateUrl: 'templates/session/firstTimeUser.html',
                controller: 'FirstTimeCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/session/login.html',
                controller: 'LoginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/session/register.html',
                controller: 'RegisterCtrl'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl',
                onEnter: function ($state, Auth) {
                    if (!Auth.isLoggedIn()) {
                        $state.go('login');
                    }
                }
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
            .state('app.map', {
                url: '/map',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: function ($scope, $rootScope, singleMap, $ionicHistory) {

                            $scope.lastView = $ionicHistory.backView();
                            console.log($scope.lastView)
                            $scope.langs = singleMap.selectedClinicMap;
                            $scope.clinicName = singleMap.selectedClinicName;
                        }
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
                        controller: 'singleClinicCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/mainPage');
    });