controllers
    .controller('FirstTimeCtrl', function ($scope, $state, $http, sessionService, Auth, $rootScope, $ionicLoading) {

        $scope.userExists = false;
        // console.log($rootScope.forgotPassword)
        //localStorage.removeItem("registerInfoCompleted")

        $scope.submitNumber = function (theForm) {
            localStorage.removeItem("registerInfo");
            if (theForm) {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });
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
                        console.log(response)
                        $scope.user.phone = "";
                        $scope.verification_pass = response.data.code;
                        sessionService.set('vcode', response.data.code);
                        sessionService.set('userId', response.data.user_id);
                        $('.verification-pane').css('left', '0');
                    },
                    function (response) { // optional
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "{{'slow_internet' | translate}}",
                            noBackdrop: true,
                            duration: 2000
                        });
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
            //console.log($scope.verification_pass, '$scope.verification_pass')
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
                            //console.log(response);
                            //Auth.setUser(response.data.token);
                            sessionService.set('registerToken', response.data.token);
                            //sessionService.set('user_idd', response.data.user_id);
                            sessionService.set("registerInfo", response.data);
                            //console.log(localStorage.getItem("registerInfo"));
                            $state.go('register');
                            if (response.data.login != null) {
                                $rootScope.forgotPassword = true
                            }
                        } else {
                            $scope.userExists = true;
                        }
                    },
                    function (response) { // optional
                        $scope.loggingIn = false;
                        $ionicLoading.show({
                            template: "{{'slow_internet' | translate}}",
                            noBackdrop: true,
                            duration: 2000
                        });
                    });
            } else {
                // console.log("Wrong Verification");
                $ionicLoading.hide();
                $scope.submitted = true;
            }
        }
    })
    .controller('LoginCtrl', function ($scope, $http, $state, Auth, $ionicLoading, $rootScope, $timeout, $window, $translate) {

        $scope.langKey = $translate.use();

        $scope.langOptions = [
            {
                key: "uz",
                value: "UZ"
            },
            {
                key: "ru",
                value: "RU"
            }
        ];

        $scope.language = 'ru'

        $scope.updateLang = function (key) {
            $translate.use(key);
        }

        if (localStorage.getItem("session") != null) {
            $state.go("app.mainPage")
        }

        $rootScope.forgotPassword = false;

        $scope.loggingIn = false;
        $scope.errorLogIn = false;
        $scope.signin = {};
        //console.log(Auth.getUser());
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
                }).success(function (response, event) {
                    localStorage.setItem("session", JSON.stringify(response.token));
                    localStorage.setItem("registerInfoCompleted", JSON.stringify(response));
                    $rootScope.userInfo = response;
                    $state.go("app.mainPage");

                    //$window.location.href = "/login";

                    //$state.go('app.mainPage');
                    //$ionicLoading.hide();
                    $scope.errorLogIn = false;
                    // console.log(response);
                    //  if (localStorage.getItem("registerInfoCompleted") == null) {
                    $ionicLoading.hide();


                    $timeout(function () {
                        // alert('second');
                        $state.go("app.mainPage", {}, {
                            reload: "app.mainPage"
                        });
                        // $window.location.reload()
                        // $ionicLoading.hide();
                    }, 500);
                    // }) //else {
                    //localStorage.setItem("registerInfoCompleted", JSON.stringify(response));
                    // $timeout(function () {
                    //    $state.go('app.mainPage');
                    //   $ionicLoading.hide();
                    //   }, 500)
                    // }
                    //$state.go('app.mainPage');
                    //$rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
                    //$rootScope.userInfo = JSON.parse($rootScope.savedLocalStorage);

                }).error(function (response) { // optional
                    //$scope.meaninga = response;
                    //salert(response)
                    console.log(response)
                    $ionicLoading.hide();
                    $scope.errorLogIn = true;
                    if (response.data == "Не верный логин и/или пароль") {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "Не верный логин и/или пароль",
                            noBackdrop: true,
                            duration: 2000
                        });
                    }
                    if (response == null) {
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "{{'slow_internet' | translate}}",
                            noBackdrop: true,
                            duration: 2000
                        });
                    }
                });
            } else {
                //console.log("login form is FALSE");
                $scope.errorClass = true;
            }

        }
        $scope.openAccount = function (bool) {
            $rootScope.forgotPassword = bool;
            $state.go('firstTimeUser', {}, {
                reload: true
            });
        }
    })
    .controller('RegisterCtrl', function ($scope, Upload, $http, Auth, sessionService, ionicDatePicker, $filter, $ionicLoading, $state, $rootScope, $window, $timeout) {


        //console.log($rootScope.forgotPassword)
        //localStorage.removeItem("registerInfoCompleted");
        // console.log(localStorage.getItem("registerInfoCompleted"))
        $scope.openFile = function () {
            $("#my_pro_file").trigger('click');
        }

        var ipObj1 = {
            callback: function (val) { //Mandatory 
                //console.log('Return value from the datepicker popup is : ', new Date(val));
                //$scope.user.birth_date = 
                $scope.formattedDate = new Date(val);
                // console.log($scope.formattedDate);
                $scope.user.birth_date = $filter('date')($scope.formattedDate, "dd/MM/yyyy");
                // console.log($scope.user.birth_date);
            },
            inputDate: new Date(90, 5, 5)
        }

        $scope.openDatePicker = function () {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.user = JSON.parse(localStorage.getItem("registerInfo"));
        // console.log($scope.user)

        //console.log(sessionService.get('registerToken'));
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

        console.log($scope.user.user_id)
        
        $scope.createUser = function (valid, fileToUpload) {

            if (valid) {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });

                // $scope.user.photo = $scope.userphoto.name

                var dataUpdate = new FormData();
                
                console.log($scope.user.user_id)
                
                //if ($scope.user.photo != null || $scope.user.photo != undefined) {
                dataUpdate.append("photo", fileToUpload);
                //}
                if ($scope.user.birth_date != null) {
                    dataUpdate.append("birth_date", $scope.user.birth_date);
                }
                dataUpdate.append("login", $scope.user.login);
                dataUpdate.append("name", $scope.user.name);
                dataUpdate.append("user_id", $scope.user.user_id);
                dataUpdate.append("password", $scope.user.password);
                dataUpdate.append("phone", $scope.user.phone);
                if ($scope.user.email != null) {
                    dataUpdate.append("email", $scope.user.email);
                }

                for (var key of dataUpdate.entries()) {
                    console.log(key[0] + ', ' + key[1]);
                }

                console.log(dataUpdate, $scope.user);

                var updateUrl;
                if ($rootScope.forgotPassword == true) {
                    updateUrl = 'update'
                } else {
                    updateUrl = 'sign-up'
                }
                
                console.log(updateUrl)

                $.ajax({
                    url: 'http://medappteka.uz/api/user/' + updateUrl,
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: dataUpdate,
                    type: 'POST',
                    success: function (response) {
                        //console.log(localStorage.getItem("registerInfoCompleted"));
                        // console.log(response);
                        sessionService.set("registerInfoCompleted", response);
                        //console.log(localStorage.getItem("registerInfoCompleted"));
                       // $rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
                        // console.log($rootScope.savedLocalStorage, '$rootScope.savedLocalStorage')
                        $rootScope.userInfo = sessionService.get("registerInfoCompleted")
                        // console.log($rootScope.userInfo)
                        //console.log(localStorage.getItem("registerInfo"));

                        //console.log(Auth.getUser());
                        //$scope.$apply()

                        $ionicLoading.hide();
                        $timeout(function () {
                            // alert('second');
                            $state.go("app.mainPage", {}, {
                                reload: "app.mainPage"
                            });
                            // $window.location.reload()
                            // $ionicLoading.hide();
                        }, 500);

                        // var qwe = $rootScope.userInfo.birth_date.slice(-4);
                        // $scope.currentAge = (new Date()).getFullYear() - parseFloat(qwe);
                    },
                    error: function (error) {
                        console.log(error);
                        $ionicLoading.hide();
                        if (error.readyState == 0) {
                            $ionicLoading.show({
                                template: "{{'slow_internet' | translate}}",
                                noBackdrop: true,
                                duration: 2000
                            });
                        }
                        if (error.responseJSON.message == "Логин уже занят") {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: "{{'login_taken' | translate}}",
                                noBackdrop: true,
                                duration: 2000
                            });
                        }
                        if (error.responseJSON.message == "E-mail уже занят") {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: "{{'email_taken' | translate}}",
                                noBackdrop: true,
                                duration: 2000
                            });
                        }
                    }
                });




                /* $http({
                    method: 'POST',
                    url: 'http://medappteka.uz/api/user/sign-up',
                    data: dataUpdate,
                }).then(function (response, a, b, c) {
                        $scope.verification_pass = response.data.code;
                        sessionService.set('vcode', response.data.code);
                        sessionService.set('userId', response.data.user_id);

                        Auth.userInfo.user_id = response.data.user_id;
                        $('.verification-pane').css('left', '0');
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
                    });*/
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
        }
    });