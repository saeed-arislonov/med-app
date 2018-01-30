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
        ]);