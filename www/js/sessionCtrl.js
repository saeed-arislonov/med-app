controllers
    .controller('FirstTimeCtrl', function ($scope, $state) {
        $scope.submitNumber = function (theForm) {
            console.log($scope.user.phone)
            if (theForm) {
                $('.verification-pane').css('left', '0');
            } else {
                $scope.inputEmpty = true;
            }
        }
        $scope.submitted = false;
        $scope.verification_pass = '4444';
        $scope.user = {};
        $scope.submitVerification = function (mmm) {
            $scope.submitted = true;
            $scope.result = angular.equals($scope.verification_pass, $scope.user.vcode);
            if ($scope.result) {
                $state.go('register')
            } else {
                console.log("Wrong Verification");
            }
        }
    })
    .controller('LoginCtrl', function ($scope) {

    })
    .controller('RegisterCtrl', function ($scope, Upload) {

        $scope.user = {};
        /*$scope.createUser = function () {
            console.log($scope.user)
        }*/
console.log(Upload)
        $scope.createUser = function (file) {
            console.log($scope.user);
            /*file.upload = Upload.upload({
                url: 'http://medappteka.uz/api/user/sign-up',
                data: $scope.user
            });

            file.upload.then(function (response) {
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