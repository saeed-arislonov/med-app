// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'ngTouch', 'ui.bootstrap', 'starter.factories', 'starter.filters', 'ngMap', 'ngFileUpload', 'ionic-datepicker', 'ngCordova'])

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
		$httpProvider.defaults.headers.common = {};
		$httpProvider.defaults.headers.put = {};
		$httpProvider.defaults.headers.patch = {};
		$httpProvider.defaults.headers.post = {};
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
						controller: function () {}
					}
				}
			})
			.state('app.myOrders', {
				url: '/my-orders',
				views: {
					'menuContent': {
						templateUrl: 'templates/myOrders.html',
						controller: function () {}
					}
				}
			})
			.state('app.profile', {
				url: '/menu',
				views: {
					'menuContent': {
						templateUrl: 'templates/profile.html',
						controller: function ($scope, Auth, $state, $rootScope, ionicDatePicker, $filter, $ionicLoading, $http, Upload, $timeout) {
							console.log($rootScope.userInfo.birth_date);
							$scope.signOut = function () {
								Auth.logout();
								$state.go('login');
							}

							if ($rootScope.userInfo.birth_date == 'null') {
								$rootScope.userInfo.birth_date = ''
							} else {

								var qwe = $rootScope.userInfo.birth_date.slice(-4);
								$scope.currentAge = (new Date()).getFullYear() - parseFloat(qwe);
								console.log($scope.currentAge, qwe)
							}
							if ($rootScope.userInfo.email == 'null') {
								$rootScope.userInfo.email = ''
							}

							var ipObj1 = {
								callback: function (val) { //Mandatory 
									console.log('Return value from the datepicker popup is : ', new Date(val));
									//$scope.user.birth_date = 
									$scope.formattedDate = new Date(val);
									$rootScope.userInfo.birth_date = $filter('date')($scope.formattedDate, "dd/MM/yyyy");
								}
							}

							$scope.openDatePicker = function () {
								ionicDatePicker.openDatePicker(ipObj1);
							};

							$scope.toggleEdit = function () {
								$('.ma-profile-edit').slideDown();
								$('.ma-menu').slideUp();
							}

							$scope.toggleMenu = function () {
								$('.ma-profile-edit').slideUp();
								$('.ma-menu').slideDown();
							}




							$scope.uploadPic = function (file) {
								console.log(file)
								file.upload = Upload.upload({
									url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
									data: {
										username: 'asasdasd',
										file: file
									},
								});

								file.upload.then(function (response) {
									console.log(response)
									$timeout(function () {
										file.result = response.data;
									});
								}, function (response) {
									console.log(response)
									if (response.status > 0)
										$scope.errorMsg = response.status + ': ' + response.data;
								}, function (evt) {
									// Math.min is to fix IE which reports 200% sometimes
									file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
								});
							}





							$scope.updateUser = function (valid, user, file) {
								if (user.password) {
									console.log('PASS')
									//delete user.password;
								} else {
									user.password = null;
								}
								console.log($rootScope.userInfo)
								if (valid) {
									$ionicLoading.show({
										template: '<ion-spinner></ion-spinner>'
									});

									Object.toparams = function ObjecttoParams(obj) {
										var p = [];
										for (var key in obj) {
											p.push(key + '=' + encodeURIComponent(obj[key]));
										}
										return p.join('&');
									};

									$http({
										method: 'POST',
										url: 'http://medappteka.uz/api/user/update',
										data: Object.toparams($rootScope.userInfo),
										headers: {
											//'Authorization': 'Bearer ' + sessionService.get('registerToken'),
											'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
										}
									}).then(function (response, a, b, c) {

											console.log(response)
											localStorage.setItem("registerInfoCompleted", JSON.stringify(response.data));
											console.log(localStorage.getItem("registerInfoCompleted"));
											$rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
											console.log($rootScope.savedLocalStorage, '$rootScope.savedLocalStorage')
											$rootScope.userInfo = JSON.parse($rootScope.savedLocalStorage);
											$ionicLoading.hide();
											$ionicLoading.show({
												template: 'Аккаунт обновлен.',
												noBackdrop: true,
												duration: 1000
											});
											var qwe = $rootScope.userInfo.birth_date.slice(-4);
											$scope.currentAge = (new Date()).getFullYear() - parseFloat(qwe);
											//Auth.setUser(response.data.token);
											//console.log(Auth.getUser());
											//$state.go('app.mainPage');
										},
										function (response, a, b, c) { // optional
											console.log("FAIL ", response, a, b, c);
											$ionicLoading.hide();
										});
								} else {
									$scope.submitted = true
								}
							}
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