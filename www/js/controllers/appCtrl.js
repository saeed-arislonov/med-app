controllers
  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $rootScope, $cordovaGeolocation, $ionicLoading, $cordovaNetwork, $timeout, $state, $ionicHistory) {

    var posOptions = {
      timeout: 10000,
      enableHighAccuracy: false
    };

    if (localStorage.getItem("session") == null) {
      $state.go("login")
    }

    $rootScope.go_back_1 = function () {
      
      console.log($ionicHistory.viewHistory())
      if($ionicHistory.viewHistory().backView == null){
        $state.go('app.mainPage')
      } else {
        $ionicHistory.goBack();
      }
    }


    //$timeout(function(){
    document.addEventListener("deviceready", function () {

      $scope.network = $cordovaNetwork.getNetwork();
      $scope.isOnline = $cordovaNetwork.isOnline();
      $scope.$apply();

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        $scope.isOnline = true;
        $scope.network = $cordovaNetwork.getNetwork();

        $scope.$apply();
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        console.log("got offline");
        $scope.isOnline = false;
        $scope.network = $cordovaNetwork.getNetwork();
        $ionicLoading.show({
          template: 'Интернет отключен на вашем устройстве.',
          noBackdrop: true,
          duration: 2000
        });

        $scope.$apply();
      })

    }, true);
    // }, 5000)
    document.addEventListener("deviceready", function () {

      $scope.network = $cordovaNetwork.getNetwork();
      $scope.isOnline = $cordovaNetwork.isOnline();
      $scope.$apply();

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        $scope.isOnline = true;
        $scope.network = $cordovaNetwork.getNetwork();

        $scope.$apply();
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        console.log("got offline");
        $scope.isOnline = false;
        $scope.network = $cordovaNetwork.getNetwork();

        $scope.$apply();
      })

    }, false);


    //localStorage.removeItem('shoppingCart');
    if ($rootScope.userInfo == null) {
      $rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
      $rootScope.userInfo = JSON.parse($rootScope.savedLocalStorage);
    }

    /*console.log($rootScope.userInfo);*/

    $rootScope.savedCart = localStorage.getItem('shoppingCart');
    $rootScope.shoppingCart = (localStorage.getItem('shoppingCart') !== null) ? JSON.parse($rootScope.savedCart) : [];
    localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));

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
        template: "{{'med_added_tocart' | translate}}",
        noBackdrop: true,
        duration: 1000
      });
      localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
      /* console.log('LocalStorage ===>>> ', localStorage.getItem('shoppingCart'));
       console.log('$rootScope.shoppingCart === >', $rootScope.shoppingCart);*/
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
        template: "{{'med_removed_tocart' | translate}}",
        noBackdrop: true,
        duration: 1000
      });
      localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
      /*console.log($rootScope.shoppingCart, '$rootScope.shoppingCart')
      console.log(localStorage.getItem('shoppingCart'))*/
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