// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var med_app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'ngTouch', 'ui.bootstrap', 'starter.factories', 'starter.filters', 'ngMap', 'ngFileUpload', 'ionic-datepicker', 'ngCordova', 'pascalprecht.translate']);

med_app
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
    .config(function (ionicDatePickerProvider) {
        var datePickerObj = {
            inputDate: new Date(),
            titleLabel: 'Дата рождения',
            setLabel: 'Применять',
            //showTodayButton: false,
            //todayLabel: 'Today',
            closeLabel: 'Закрыть',
            mondayFirst: false,
            weeksList: ["В", "П", "В", "С", "Ч", "П", "С"],
            monthsList: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Ноя", "Дек"],
            templateType: 'popup',
            from: new Date(1914, 1, 1), //Optional 
            to: new Date(2008, 10, 30), //Optional 
            showTodayButton: false,
            dateFormat: 'dd/mm/YYYY',
            closeOnSelect: false,
            disableWeekdays: [],
            selectMode: 'day'
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('timeoutHttpIntercept');
        $httpProvider.defaults.timeout = 5000;
        //$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

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
                controller: 'RegisterCtrl',
                onEnter: function (sessionService, $state) {
                    if (sessionService.get('vcode') == undefined) {
                        $state.go('login');
                    }
                    //console.log(sessionService.get('vcode'))
                }
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
                        controller: function ($rootScope) {

                        }
                    }
                }
            })
            .state('app.singleOrder', {
                url: '/singleOrder',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/single-order.html',
                        controller: function ($scope, $rootScope) {
                            $scope.callPharmacy = function(ord){
                                window.location.href = 'tel:' + ord.medicine.pharmacy.contacts;
                            }
                        }
                    }
                }
            })
            .state('app.myOrders', {
                url: '/my-orders',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/myOrders.html',
                        controller: function ($http, $scope, $rootScope, $ionicLoading, $state) {
                            $scope.noData = false;
                            $scope.getOrders = function () {
                                $ionicLoading.show({
                                    template: '<ion-spinner></ion-spinner>'
                                });
                                $http({
                                    method: 'GET',
                                    url: 'http://medappteka.uz/api/order/my?id=' + $rootScope.userInfo.user_id
                                }).success(function (data) {
                                    $scope.myOrderHistory = data.data;
                                    if(!$scope.myOrderHistory.length){
                                        $scope.noData = true;
                                    } else {
                                        $scope.noData = false;
                                    }
                                    console.log($scope.myOrderHistory)
                                    $ionicLoading.hide();
                                }).error(function (err) {
                                    $ionicLoading.hide();
                                    return err;
                                });
                            }
                            
                            $scope.orderDetail = function(order){
                                $rootScope.singleOrder = order;
                                $state.go('app.singleOrder');
                            }
                            $scope.getOrders()


                        }
                    }
                }
            })
            .state('app.profile', {
                url: '/menu',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'profileCtrl'
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
                        controller: 'singleClinicCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/mainPage');
    });