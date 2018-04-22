controllers
    .controller('profileCtrl', function ($scope, Auth, $state, $rootScope, ionicDatePicker, $filter, $ionicLoading, $http, Upload, $timeout) {
    
    
    $/*("#my_photo").click(function () {
            console.log('asdsa')
            $("#my_file").trigger('click');
        });
    */
    $scope.openFile = function(){
         $("#my_file").trigger('click');
    }
    
    
       /* console.log($rootScope.userInfo.birth_date);*/
        $scope.signOut = function () {
            Auth.logout();
            $state.go('login');
        }

        $scope.exitApp = function () {
            ionic.Platform.exitApp();
        }

        /*console.log($rootScope.userInfo);*/

        if ($rootScope.userInfo.birth_date == 'null' || $rootScope.userInfo.birth_date == null) {
            $rootScope.userInfo.birth_date = '';
            $scope.newArr = new Date(90, 5, 5)
        } else {

            $scope.splitted = $rootScope.userInfo.birth_date.split('/');
            $scope.newArr = new Date(parseFloat($scope.splitted[2]), parseFloat($scope.splitted[1]), parseFloat($scope.splitted[0]));
        }
        if ($rootScope.userInfo.email == 'null') {
            $rootScope.userInfo.email = ''
        }

        /*console.log($scope.newArr)*/

        var ipObj1 = {
            callback: function (val) { //Mandatory 
                /*console.log('Return value from the datepicker popup is : ', new Date(val));*/
                //$scope.user.birth_date = 
                $scope.formattedDate = new Date(val);
                $rootScope.userInfo.birth_date = $filter('date')($scope.formattedDate, "dd/MM/yyyy");
            },
            inputDate: $scope.newArr
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
        $scope.theFile = null;

        // $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        if ($rootScope.userInfo.birth_date != null) {
            (function age(birthDateString) {
                $scope.currentAge = moment($rootScope.userInfo.birth_date, "DD/MM/YYYY").fromNow().split(" ")[0];
            })()
            //$scope.currentAge = age
        }
        // }



        $scope.updateUser = function (valid, user, fileToUpload) {
            if (user.password) {
                console.log('PASS')
                //delete user.password;
            } else {
               // user.password = null;
                delete user.password;
            }

            if (valid) {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });


                var dataUpdate = new FormData();
                dataUpdate.append("photo", fileToUpload);
                dataUpdate.append("birth_date", user.birth_date);
                dataUpdate.append("login", user.login);
                dataUpdate.append("name", user.name);
                dataUpdate.append("user_id", user.user_id);
                //dataUpdate.append("password", user.password);
                if (user.email != null) {
                    dataUpdate.append("email", user.email);
                }
                if (user.password != null || user.password != undefined) {
                    dataUpdate.append("password", user.password);
                }

                for (var key of dataUpdate.entries()) {
                    console.log(key[0] + ', ' + key[1]);
                }

                /*console.log(dataUpdate)*/
                $.ajax({
                    url: 'http://medappteka.uz/api/user/update',
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: dataUpdate,
                    type: 'POST',
                    success: function (response) {
                        //console.log('response == >', response);
                        localStorage.setItem("registerInfoCompleted", JSON.stringify(response));
                       // console.log(localStorage.getItem("registerInfoCompleted"));
                        $rootScope.savedLocalStorage = localStorage.getItem('registerInfoCompleted');
                       // console.log($rootScope.savedLocalStorage, '$rootScope.savedLocalStorage')
                        $rootScope.userInfo = JSON.parse($rootScope.savedLocalStorage);
                       // console.log('$rootScope.userInfo', $rootScope.userInfo);
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: "{{'account_updated' | translate}}",
                            noBackdrop: true,
                            duration: 1000
                        });
                        $scope.currentAge = moment($rootScope.userInfo.birth_date, "DD/MM/YYYY").fromNow().split(" ")[0];
                    },
                    error: function (error, a, b, c) {
                        console.log(error, a, b, c);
                        $ionicLoading.hide();
                        if (error.readyState == 0) {
                            $ionicLoading.show({
                                template: "{{'slow_internet' | translate}}",
                                noBackdrop: true,
                                duration: 2000
                            });
                        }
                        if(error.responseJSON){
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
                    }
                });
            } else {
                $scope.submitted = true;
                console.log('not valid')
            }
        }
    })