controllers
	.controller('FirstTimeCtrl', function ($scope, $state, $http, sessionService, Auth, $rootScope, $ionicLoading) {

		$scope.userExists = false;

		$scope.submitNumber = function (theForm) {
			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner>'
			});
			localStorage.removeItem("registerInfo");
			if (theForm) {
				// $('.verification-pane').css('left', '0');
		
				var user_phone = '998' + $scope.user.phone;
				Auth.userInfo.phone = user_phone;

				$http({
					method: 'POST',
					url: 'http://medappteka.uz/api/user/send-phone',
					data: Object.toparams({
						"phone": user_phone
					}),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function (response, a, b, c) {
						$ionicLoading.hide();
						$scope.verification_pass = response.data.code;
						sessionService.set('vcode', response.data.code);
						sessionService.set('userId', response.data.user_id);
						$('.verification-pane').css('left', '0');
					},
					function (response) { // optional
						$ionicLoading.hide();
						console.log("FAIL ", response);
					});
			} else {
				$scope.submitted = false;
			}
		}

		$scope.backToLogin = function () {
			$state.go('login', {}, {
				reload: true
			});
		}

		$scope.reSendCode = function () {
			$('.verification-pane').css('left', '100%');
			$scope.user.phone = '';
			$scope.submitted = false;
		}

		$scope.submitted = false;

		$scope.user = {};

		$scope.submitVerification = function () {
			$scope.submitted = true;
			console.log($scope.verification_pass, '$scope.verification_pass')
			if ($scope.verification_pass == $scope.user.vcode) {
				$ionicLoading.show({
					template: '<ion-spinner></ion-spinner>'
				});
				$scope.verify_user = {
					user_id: sessionService.get('userId'),
					phone_code: sessionService.get('vcode'),
				}

				$http({
					method: 'POST',
					url: 'http://medappteka.uz/api/user/send-code',
					data: Object.toparams($scope.verify_user),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function (response) {
						console.log(response)
						$ionicLoading.hide();
						if (response.data.hasOwnProperty('token')) {
							console.log(response);
							Auth.userInfo.phone = response.data.phone;
							sessionService.set('registerToken', response.data.token);
							sessionService.set('user_idd', response.data.user_id);
							localStorage.setItem("registerInfo", JSON.stringify(response.data));
							console.log(localStorage.getItem("registerInfo"));
							$state.go('register');
						} else {
							$scope.userExists = true;
						}
					},
					function (response) { // optional
						$scope.loggingIn = false;
						console.log("FAIL ", response);
					});
			} else {
				console.log("Wrong Verification");
				$ionicLoading.hide();
				$scope.submitted = true;
			}
		}
	})
	.controller('LoginCtrl', function ($scope, $http, $state, Auth, $ionicLoading, $rootScope) {

		$state.go($state.current, {}, {
			reload: true
		});

		$scope.loggingIn = false;
		$scope.errorLogIn = false;
		$scope.signin = {};
		console.log(Auth.getUser());
		$scope.submitLogin = function (valid) {
			$scope.errorClass = false;
			$scope.errorLogIn = false;

			if (valid) {
				$ionicLoading.show({
					template: '<ion-spinner></ion-spinner>'
				});

				$http({
					method: 'POST',
					url: 'http://medappteka.uz/api/user/sign-in',
					data: Object.toparams($scope.signin),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function (response) {
						$ionicLoading.hide();
						$scope.errorLogIn = false;
						console.log(response);
						localStorage.removeItem("registerInfoCompleted");
						localStorage.setItem("registerInfoCompleted", JSON.stringify(response.data));
						$rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
						$rootScope.userInfo = JSON.parse($rootScope.savedLocalStorage);
						Auth.setUser(response.data.token);
						$state.go('app.mainPage');
					},
					function (response) { // optional
						$ionicLoading.hide();
						$scope.errorLogIn = true;
						console.log("FAIL ", response);
					});
			} else {
				console.log("login form is FALSE");
				$scope.errorClass = true;
			}

		}
		$scope.openAccount = function () {
			$state.go('firstTimeUser', {}, {
				reload: true
			});
		}
	})
	.controller('RegisterCtrl', function ($scope, Upload, $http, Auth, sessionService, ionicDatePicker, $filter, $ionicLoading, postService, $state) {

		var ipObj1 = {
			callback: function (val) { //Mandatory 
				console.log('Return value from the datepicker popup is : ', new Date(val));
				//$scope.user.birth_date = 
				$scope.formattedDate = new Date(val);
				console.log($scope.formattedDate);
				$scope.user.birth_date = $filter('date')($scope.formattedDate, "dd/MM/yyyy");
				console.log($scope.user.birth_date);
			}
		}

		$scope.openDatePicker = function () {
			ionicDatePicker.openDatePicker(ipObj1);
		};

		$scope.user = JSON.parse(localStorage.getItem("registerInfo"));
		console.log($scope.user)

		console.log(sessionService.get('registerToken'));
		var config = {}



		/*$scope.createUser = function (name, phone, photo, birth_date, email, login, password) {
			postService.uploadFileToUrl(name, phone, photo, birth_date, email, login, password).then(function (response, a, b, c) {
				 console.log(response, a, b, c)
					//$ionicLoading.hide();
					//$scope.verification_pass = response.data.code;
				//	sessionService.set('vcode', response.data.code);
					//sessionService.set('userId', response.data.user_id);

					//Auth.userInfo.user_id = response.data.user_id;
					//$('.verification-pane').css('left', '0');
					//console.log(sessionService.get('vcode'));
					//Auth.setUser(response.data.token);
					//console.log(Auth.getUser());
					//$state.go('app.mainPage');
				},
				function (response, a, b, c) { // optional
					$ionicLoading.hide();
					console.log("FAIL ", response, a, b, c);
				});
		};*/

		$scope.createUser = function (valid) {

			if (valid) {
				$ionicLoading.show({
					template: '<ion-spinner></ion-spinner>'
				});

				$http({
					method: 'POST',
					url: 'http://medappteka.uz/api/user/sign-up',
					data: Object.toparams($scope.user),
					headers: {
						//'Authorization': 'Bearer ' + sessionService.get('registerToken'),
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}).then(function (response, a, b, c) {
						//$scope.verification_pass = response.data.code;
						//sessionService.set('vcode', response.data.code);
						//sessionService.set('userId', response.data.user_id);

						//Auth.userInfo.user_id = response.data.user_id;
						//$('.verification-pane').css('left', '0');
						console.log(response)
						localStorage.setItem("registerInfoCompleted", JSON.stringify(response.data));
						console.log(localStorage.getItem("registerInfoCompleted"));
						//console.log(localStorage.getItem("registerInfo"));
						$ionicLoading.hide();
						Auth.setUser(response.data.token);
						//console.log(Auth.getUser());
						$state.go('app.mainPage');
					},
					function (response) { // optional
						console.log("FAIL ", response);
						$ionicLoading.hide();
					});
			} else {
				$scope.submitted = true
			}


			//$http.defaults.headers.common.Authorization = "Bearer " + sessionService.get('registerToken');
			/*console.log(sessionService.get('registerToken'))
			$http({
				method: 'POST',
				url: 'http://medappteka.uz/api/user/sign-up',
				data: Object.toparams({
					name: 'Saeed'
				}),
				headers: {
					'Authorization': 'Bearer ' + sessionService.get('registerToken'),
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function (data, status, headers, config) {
					console.log(data, status, headers, config)
					//$state.go('register');
				},
				function (data, status, headers, config) { // optional
					console.log("FAIL ", data);
					console.log(data, status, headers, config);
				});*/

			/*file.upload = Upload.upload({
			    url: 'http://medappteka.uz/api/user/sign-up',
			    data: $scope.user,
			    headers: {
			        'Authorization': "Bearer " + Auth.getUser(),
			        'Content-Type': "application/x-www-form-urlencoded"
			    }
			});*/

			/*file.upload.then(function (response) {
			    $timeout(function () {
			        console.log(response);
			        file.result = response.data;
			    });
			}, function (response) {
			    console.log(response);
			    if (response.status > 0)
			        $scope.errorMsg = response.status + ': ' + response.data;
			});*/
		}
	});