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
    .controller('LoginCtrl', function ($scope, $http) {
        $scope.signin = {};
    $scope.successs = ""
        $scope.submitLogin = function(){
            console.log($scope.signin);
            $http.post('http://medappteka.uz/api/user/sign-in', $scope.signin)
                .success(function(resp){
                console.log(resp);
                $scope.successs = "LOGGED IN"
            }).error(function(err, a, b, c){
                console.log(err, a, b, c);
                $scope.successs = "ERROR"
            })
        }
    })
    .controller('RegisterCtrl', function ($scope, Upload, $http) {

        $scope.user = {};
        /*$scope.createUser = function () {
            console.log($scope.user)
        }*/
    
    $scope.userr = {
        name: "Saeed",
        phone: "998977887978",
        birth_date: "12/12/1993",
        email: "saidbek111@gmail.com",
        login: "saidbekars137",
        password: "123qwe123",
        photo: null
    };
    
     $scope.json = angular.toJson($scope.userr);
        $scope.createUser = function (file) {
            console.log($scope.userr);
            //$scope.userr = JSON.stringify($scope.userr);
            console.log($scope.userr);
            console.log($scope.json);
            $http.post('http://medappteka.uz/api/user/sign-up', $scope.json)
                .success(function(resp){
                    console.log(resp);
            }).error(function(a, b, c, d){
                console.log(a, b, c, d);
            })
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