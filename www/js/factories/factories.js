angular.module('starter.factories', [])
    .factory('orderCount', function ($http) {

        return {
            total: "",
            orderCount: function () {
                $http.get('../data/cart.json')
                    .success(function (data) {
                        return data.length
                    })
            },
            updateCount: function () {
                return $http.get('../data/cart.json');
            }
        }

    })
    .factory('singleMap', function () {
        return {
            selectedClinicMap: "",
            selectedClinicName: ""
        }
    })
    .service('IonicClosePopupService', [
            function () {
            var currentPopup;
            var htmlEl = angular.element(document.querySelector('html'));
            htmlEl.on('click', function (event) {
                if (event.target.nodeName === 'HTML') {
                    if (currentPopup) {
                        currentPopup.close();
                    }
                }
            });

            this.register = function (popup) {
                currentPopup = popup;
            }
            }
        ])
    .factory('sessionService', ['$http', function ($http) {
        return {
            set: function (key, value) {
                return localStorage.setItem(key, JSON.stringify(value));
            },
            get: function (key) {
                return JSON.parse(localStorage.getItem(key));
            },
            destroy: function (key) {
                return localStorage.removeItem(key);
            },
        };
    }])
    .factory('Auth', function () {
        if (window.localStorage['session']) {
            var _user = JSON.parse(window.localStorage['session']);
        }
        var setUser = function (session) {
            _user = session;
            window.localStorage['session'] = JSON.stringify(_user);
        }
        var setRegisterToken = function (regToken) {
            //_regToken = regToken;
            window.localStorage['registerToken'] = JSON.stringify(regToken);
        }

        return {
            userInfo: {},
            setUserPhone: "",
            setRegisterToken: setRegisterToken,
            getRegisterToken: function () {
                return JSON.parse(window.localStorage['registerToken'])
            },
            userId: "",
            setUser: setUser,
            isLoggedIn: function () {
                return _user ? true : false;
            },
            getUser: function () {
                return _user;
            },
            logout: function () {
                window.localStorage.removeItem("session");
                window.localStorage.removeItem("list_dependents");
                _user = null;
            }
        }
    }).factory('timeoutHttpIntercept', function ($rootScope, $q, $injector) {
        return {
            'request': function (config) {
                config.timeout = 10000;
                var $ionicLoading = $injector.get('$ionicLoading');
                return config;
            }
        };
    });