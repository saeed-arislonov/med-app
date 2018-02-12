controllers
    .controller('profileCtrl', function ($scope, Auth, $state, $rootScope, ionicDatePicker, $filter, $ionicLoading, $http, Upload, $timeout) {
        console.log($rootScope.userInfo.birth_date);
        $scope.signOut = function () {
            Auth.logout();
            $state.go('login');
        }

        console.log($rootScope.userInfo);

        if ($rootScope.userInfo.birth_date == 'null' || $rootScope.userInfo.birth_date == null) {
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
    })