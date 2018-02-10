var controllers = angular.module('starter.controllers', []);

Object.toparams = function ObjecttoParams(obj) {
	var p = [];
	for (var key in obj) {
		p.push(key + '=' + encodeURIComponent(obj[key]));
	}
	return p.join('&');
};

controllers
	.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $rootScope) {

		$rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
		$rootScope.userInfo = JSON.parse($rootScope.savedLocalStorage);
		console.log($rootScope.userInfo);




		$rootScope.savedCart = localStorage.getItem('shoppingCart');
		$rootScope.shoppingCart = (localStorage.getItem('shoppingCart') !== null) ? JSON.parse($rootScope.savedCart) : [];
		localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));


		$rootScope.addToCart = function (index, med) {
			med.added_to_cart = true;
			$rootScope.shoppingCart.push({
				"id": index + 1,
				"med_name": med.med_name,
				"manufacturer": med.manufacturer,
				"pharmacy": med.ph_name,
				"ph_image": med.ph_image,
				"address": med.address,
				"phone": med.ph_phone,
				"price": med.price,
				"cart_count": "1"
			});

			$ionicLoading.show({
				template: 'Добавлено в корзину',
				noBackdrop: true,
				duration: 1000
			});
			localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
		};



		/*$rootScope.addToCart = function () {
			$rootScope.shoppingCart.push();
			$scope.todoText = ''; //clear the input after adding
			localStorage.setItem('shoppingCart', JSON.stringify($rootScope.shoppingCart));
		};*/

		$rootScope.cartCount = function () {
			var count = 0;
			angular.forEach($scope.shoppingCart, function (todo) {
				count += todo.done ? 0 : 1;
			});
			return count;
		};



		$rootScope.removeFromCart = function (index, med) {
			//med.added_to_cart = false;
			$rootScope.cartData = $rootScope.cartData.filter(function (item) {
				return item.id !== parseInt(med.id);
			});
			$ionicLoading.show({
				template: 'Удалено из корзины',
				noBackdrop: true,
				duration: 1000
			});
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

	.controller('MainPageCtrl', function ($scope, $http, $rootScope, $state, $ionicLoading) {

		var medicine_url = 'http://medappteka.uz/api/medicine'
		$http({
			method: 'GET',
			url: medicine_url
		}).success(function (data) {
			$scope.medicines = data.data;
			console.log($scope.medicines)
		}).error(function (err) {
			return err;
		});
	
		var specialization_url = 'http://medappteka.uz/api/inst/specializations';
		$http({
			method: 'GET',
			url: specialization_url
		}).success(function (data) {
			$scope.specializations = data.data;
			console.log($scope.specializations)
		}).error(function (err) {
			return err;
		});
		/* $http.get('data/medicines.json').success(function (data) {
		     $scope.medicines = data;
		 }).error(function (err) {
		     return err;
		 });*/

		$scope.setMedicine = function (med) {
			$rootScope.selectedMedicine = med;
			localStorage.setItem('med_id', med);
		}

		$scope.setClinic = function (clinic) {
			$rootScope.selectedClinic = clinic;
		}

		$scope.active = 'medicine';
		$scope.productPlaceholder = 'введите название товара'
		$scope.setActive = function (type) {
			$scope.active = type;
			if (type == 'medicine') {
				$scope.productPlaceholder = ' введите название товара'
				$scope.active = 'medicine'
			} else {
				$scope.productPlaceholder = 'введите название или профиль'
				$scope.active = 'clinic';
			}
		};
		$scope.isActive = function (type) {
			return type === $scope.active;
		};

		$scope.submitSearch = function () {
			console.log('CLICKKCKC');
			console.log($rootScope.selectedMedicine)
			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner>'
			});
			if ($scope.active == 'medicine') {
					console.log('active medicine');

					$http({
						method: 'POST',
						url: 'http://medappteka.uz/api/medicine/search',
						data: Object.toparams({query : $rootScope.selectedMedicine.name}),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).success(function (data) {
						console.log(data)
						$rootScope.pharmacies = data.data;
						$ionicLoading.hide();
						$state.go('app.medicines');
					}).error(function (err, a, b, c) {
						console.log(err, a, b, c);
						$ionicLoading.hide();
					});
			} else {
				$http({
						method: 'POST',
						url: 'http://medappteka.uz/api/inst/search-by-spec',
						data: Object.toparams({query : $rootScope.selectedClinic.name}),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).success(function (data) {
						console.log(data)
						$rootScope.clinics = data.data;
						$ionicLoading.hide();
						$state.go('app.clinics');
					}).error(function (err, a, b, c) {
						console.log(err, a, b, c);
						$ionicLoading.hide();
					});
			}
		}

		//$http.get('http://medappteka.uz/api/cart').success(handleSuccess);

	})

	.controller('ResultCtrl', function ($scope, $stateParams, $ionicLoading, $rootScope, $http, $ionicPopover, $ionicModal, orderCount, $filter, NgMap, $ionicPlatform, $ionicScrollDelegate, $cordovaGeolocation) {


		/*$ionicLoading.show({
      template: 'загрузка...'
    });*/

		var options = {
			enableHighAccuracy: true
		};

		navigator.geolocation.getCurrentPosition(function (pos) {

				var posOptions = {
					timeout: 10000,
					enableHighAccuracy: false
				};
				$cordovaGeolocation
					.getCurrentPosition(posOptions)
					.then(function (position) {
						var lat = position.coords.latitude
						var long = position.coords.longitude
						console.log(position)
						$scope.currentPosition = new google.maps.LatLng(lat, long);
					}, function (err) {
						// error
					});
				console.log(JSON.stringify($scope.currentPosition));
			},
			function (error) {
				alert('Unable to get location: ' + error.message);
			}, options);


		NgMap.getMap().then(function (map) {
			$rootScope.map = map;
		});

		$scope.medMapPresent = false;

		$scope.showMapMed = function (med) {
			$scope.singleView = true;
			if ($scope.medMapPresent) {
				$scope.medMapPresent = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				$ionicScrollDelegate.scrollTop();
				$scope.singlePosition = med.lang + ',' + med.long;
				$scope.medMapPresent = true;
				$('.medicineMapView').addClass('medicineMapPresent');
			}
		}

		$scope.showMapAll = function () {
			$scope.singleView = false;
			if ($scope.medMapPresent) {
				$scope.medMapPresent = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				//$scope.singlePosition = med.lang + ',' + med.long;
				$scope.medMapPresent = true;
				$('.medicineMapView').addClass('medicineMapPresent');
				//console.log($scope.singlePosition);
			}
		}

		$ionicPlatform.registerBackButtonAction(function (event) {
			if ($('.medicineMapView').hasClass('medicineMapPresent')) {
				$scope.medMapPresent = false;
				$scope.singleView = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				navigator.app.backHistory();
			}
		}, 100);

		$scope.callTel = function (med) {
			window.location.href = 'tel:' + med.ph_phone;
		}


		/* ========  Display Filters ============*/

		$scope.filterOpen = false; //hide filter by default
		$scope.isDisplayPharmacy = true;
		$scope.isDisplayPrice = false;
		$scope.isDisplayPlace = false;

		$scope.openFilter = function () {
			if ($scope.filterOpen) {
				$scope.filterOpen = false;
				$('.ma-filters').slideUp();
				$('.ma-results-wrapper').fadeIn(100);
			} else {
				$scope.filterOpen = true;
				$('.ma-filters').slideDown();
				$('.ma-results-wrapper').fadeOut(100);
			}
		}

		$scope.toggleFilterPharmacy = function () {
			if ($scope.isDisplayPharmacy) {
				$('.item-accordion-filter-pharmacy').slideUp();
				$scope.isDisplayPharmacy = false;
			} else {
				$('.item-accordion-filter-pharmacy').slideDown();
				$scope.isDisplayPharmacy = true;
			}
		}

		$scope.toggleFilterPrice = function () {
			if ($scope.isDisplayPrice) {
				$('.item-accordion-filter-price').slideUp();
				$scope.isDisplayPrice = false;
			} else {
				$('.item-accordion-filter-price').slideDown();
				$scope.isDisplayPrice = true;
			}
		}

		$scope.toggleFilterPlace = function () {
			if ($scope.isDisplayPlace) {
				$('.item-accordion-filter-place').slideUp();
				$scope.isDisplayPlace = false;
			} else {
				$('.item-accordion-filter-place').slideDown();
				$scope.isDisplayPlace = true;
			}
		}

		$scope.applyFilters = function () {
			$scope.filterOpen = false;
			$('.ma-filters').slideUp();
			$('.ma-results-wrapper').fadeIn(100);
		}


	})

	.controller('ClinicCtrl', function ($scope, $state, $stateParams, $ionicLoading, $rootScope, $http, $ionicModal, $rootScope, $ionicPlatform, $ionicScrollDelegate) {

		/*$scope.clinicLoading = true;
		$http.get("http://medappteka.uz/api/inst").success(function (data) {
			$scope.clinics = data.data;
			console.log($scope.clinics);
			$scope.clinicLoading = false;
		}).error(function (err) {
			return err;
		});*/

		$scope.go = function (param) {
			$state.go('app.singleClinic', {
				id: param
			})
		}

		$scope.filterOpen = false;
		$scope.isDisplayPharmacy = true;
		$scope.openFilter = function () {
			if ($scope.filterOpen) {
				$scope.filterOpen = false;
				$('.ma-filters').slideUp();
				$('.ma-results-wrapper').fadeIn(100);
			} else {
				$scope.filterOpen = true;
				$('.ma-filters').slideDown();
				$('.ma-results-wrapper').fadeOut(100);
			}
		}

		$scope.toggleFilterPharmacy = function () {
			if ($scope.isDisplayPharmacy) {
				$('.item-accordion-filter-pharmacy').slideUp();
				$scope.isDisplayPharmacy = false;
			} else {
				$('.item-accordion-filter-pharmacy').slideDown();
				$scope.isDisplayPharmacy = true;
			}
		}
		$scope.toggleFilterPlace = function () {
			if ($scope.isDisplayPlace) {
				$('.item-accordion-filter-place').slideUp();
				$scope.isDisplayPlace = false;
			} else {
				$('.item-accordion-filter-place').slideDown();
				$scope.isDisplayPlace = true;
			}
		}

		$scope.applyFilters = function () {
			$scope.filterOpen = false;
			$('.ma-filters').slideUp();
			$('.ma-results-wrapper').fadeIn(100);
		}


		$scope.cliMapPresent = false;

		$scope.showMapMed = function (cli) {
			$scope.singleView = true;
			if ($scope.cliMapPresent) {
				$scope.cliMapPresent = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				$ionicScrollDelegate.scrollTop();
				$scope.singlePosition = cli.lat + ',' + cli.lng;
				$scope.cliMapPresent = true;
				$('.medicineMapView').addClass('medicineMapPresent');
			}
		}

		$scope.showMapAll = function () {
			$scope.singleView = false;
			if ($scope.cliMapPresent) {
				$scope.cliMapPresent = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				//$scope.singlePosition = med.lang + ',' + med.long;
				$scope.cliMapPresent = true;
				$('.medicineMapView').addClass('medicineMapPresent');
				//console.log($scope.singlePosition);
			}
		}

		$ionicPlatform.registerBackButtonAction(function (event) {
			if ($('.medicineMapView').hasClass('medicineMapPresent')) {
				$scope.medMapPresent = false;
				$scope.singleView = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				navigator.app.backHistory();
			}
		}, 100);

	})
	.controller('CheckOut', function ($scope, $rootScope, orderCount, $state, $http) {

		$scope.confirming = false;
		$scope.submitPayment = function () {
			$scope.confirming = true;
			setTimeout(function () {
				$scope.confirming = false;
				$state.go('app.accepted')
			}, 2000)
		}

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
	.controller("CartCtrl", function ($http, $scope, $rootScope, orderCount, $filter, $ionicModal, $ionicPlatform, $ionicScrollDelegate) {
		if ($rootScope.cartData == undefined) {
			$http.get('data/cart.json').success(function (data, status) {
				$rootScope.cartData = data;
				$rootScope.cartCount = data.length;
				$scope.getTotal = function () {
					var total = 0;
					for (var i = 0; i < $rootScope.cartData.length; i++) {
						var product = $rootScope.cartData[i];
						total += (product.price * product.cart_count);
					}
					$rootScope.total = total
					return $filter('formatPrice')(total);
				}
			})
		} else {
			$scope.getTotal = function () {
				var total = 0;
				for (var i = 0; i < $rootScope.cartData.length; i++) {
					var product = $rootScope.cartData[i];
					total += (product.price * product.cart_count);
				}
				$rootScope.total = total
				return $filter('formatPrice')(total);;
			}
		}

		$scope.removeFromCart = function (index) {
			//$($event.currentTarget).closest('.medicine-result').slideUp();
			//setTimeout(function () {
			//var index = $rootScope.cartData.indexOf(cart);
			$rootScope.cartData.splice(index, 1);
			//}, 100)
			//$(this).closest('.medicine-result').slideUp();

		}

		$scope.showMapMed = function () {
			if ($scope.medMapPresent) {
				$scope.medMapPresent = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				$scope.medMapPresent = true;
				$ionicScrollDelegate.scrollTop();
				$('.medicineMapView').addClass('medicineMapPresent');
			}
		}

		$ionicPlatform.registerBackButtonAction(function (event) {
			if ($('.medicineMapView').hasClass('medicineMapPresent')) {
				$scope.medMapPresent = false;
				$('.medicineMapView').removeClass('medicineMapPresent');
			} else {
				navigator.app.backHistory();
			}
		}, 100);

		$scope.callFromCart = function (cart) {
			window.location.href = 'tel:' + cart.phone;
		}

	});