controllers
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $rootScope, $cordovaGeolocation, $ionicLoading) {

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };

//localStorage.removeItem('shoppingCart');
        $rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
        $rootScope.userInfo = JSON.parse($rootScope.savedLocalStorage);
        console.log($rootScope.userInfo);

        $rootScope.savedCart = localStorage.getItem('shoppingCart');
        $rootScope.shoppingCart = (localStorage.getItem('shoppingCart') !== null) ? JSON.parse($rootScope.savedCart) : [];
        localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
        console.log($rootScope.shoppingCart);

        $rootScope.addToCart = function (index, med) {
            med.added_to_cart = true;
            $rootScope.shoppingCart.push({
                med_id: med.id,
                med_name: med.name,
                med_price: parseFloat(med.price),
                med_photo: med.photo,
                count: 1,
                pharmacy_id: med.pharmacy.id,
                pharmacy_name: med.pharmacy.name,
                pharmacy_address: med.pharmacy.address,
                pharmacy_phone: med.pharmacy.contacts,
                pharmacy_location: med.pharmacy.lat + ',' + med.pharmacy.lng
            });

            $ionicLoading.show({
                template: 'Добавлено в корзину',
                noBackdrop: true,
                duration: 1000
            });
            localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
            console.log('LocalStorage ===>>> ', localStorage.getItem('shoppingCart'));
            console.log('$rootScope.shoppingCart === >',$rootScope.shoppingCart);
        };



        /*$rootScope.addToCart = function () {
        	$rootScope.shoppingCart.push();
        	$scope.todoText = ''; //clear the input after adding
        	localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
        };*/

        $rootScope.cartCount = function () {
            var count = 0;
            angular.forEach($scope.shoppingCart, function (cart) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };



        $rootScope.removeFromCart = function (index, med) {
            //med.added_to_cart = false;
            $rootScope.shoppingCart = $rootScope.shoppingCart.filter(function (item) {
                return item.med_id !== parseInt(med.id);
            });
            med.added_to_cart = false;
            $ionicLoading.show({
                template: 'Удалено из корзины',
                noBackdrop: true,
                duration: 1000
            });
            localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
            console.log($rootScope.shoppingCart, '$rootScope.shoppingCart')
            console.log(localStorage.getItem('shoppingCart'))
        }

        $rootScope.archive = function () {
            var oldTodos = $rootScope.shoppingCart;
            $rootScope.shoppingCart = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done)
                    $rootScope.shoppingCart.push(todo);
            });
            localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
        };

    })