controllers
  .controller('MainPageCtrl', function ($scope, $http, $rootScope, $state, $ionicLoading, $timeout, $location, $ionicPlatform, $translate, $ionicPopup, $cordovaGeolocation) {

    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };



    $cordovaGeolocation
      .getCurrentPosition(options)
      .then(function (position) {
        $scope.lat = position.coords.latitude
        $scope.long = position.coords.longitude
      }, function (err) {
        console.log(err)
        console.log('NO MAP')
        $ionicLoading.show({
          template: "{{'gps_off' | translate}}", //'Местоположение отключено',
          noBackdrop: true,
          duration: 2000
        });
      });


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



    console.log($state.current.name);

    $ionicPlatform.registerBackButtonAction(function () {
      //var path = $location.path()
      if ($state.current.name == 'app.mainPage') {
        $ionicPopup.confirm({
          template: "{{'exit_app' | translate}}",
          cancelText: 'No',
          okText: 'Yes'
        }).then(function (res) {
          if (res) {
            navigator.app.exitApp();
          }
        });

      }
    }, 100);



    var medicine_url = 'http://medappteka.uz/api/medicine/search-auto'
    $scope.fetchdata = function (data1) {
      /* console.log(data1)*/
      // condition to check for characters greater than 3.
      if (data1.length < 4) return;
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
      return $http({
        method: 'POST',
        url: 'http://medappteka.uz/api/medicine/search-auto',
        data: $.param({
          query: data1
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (response) {
         console.log(response.data.data);
        var dups = [];
        var arr = response.data.data.filter(function (el) {
          // If it is not a duplicate, return true
          if (dups.indexOf(el.name) == -1) {
            dups.push(el.name);
            return true;
          }
          return false;

        })
        $scope.medicines = arr;
       
        $ionicLoading.hide();
        return $scope.medicines;
      }, function (err) {
        $ionicLoading.show({
          template: "{{'slow_internet' | translate}}",
          noBackdrop: true,
          duration: 2000
        });
      });
    }
    /* $http({
         method: 'GET',
         url: medicine_url
     }).success(function (data) {
         $scope.medicines = data.data;
         console.log($scope.medicines)
     }).error(function (err) {
         return err;
     });*/

    $http({
      method: 'GET',
      url: 'http://medappteka.uz/api/pharmacy/districts'
    }).success(function (data) {
      $scope.districts = data.data;
      /*console.log($scope.districts)*/
    }).error(function (err) {
      $ionicLoading.show({
        template: 'Ошибка сети',
        noBackdrop: true,
        duration: 2000
      });
    });

    $scope.data = {};
    $scope.data.bgColors = [];
    $scope.data.currentPage = 0;

    var setupSlider = function () {
      //some options to pass to our slider
      $scope.data.sliderOptions = {
        initialSlide: 0,
        autoplay: 1000,
        loop: true,
        direction: 'horizontal', //or vertical
        speed: 300 //0.3s transition
      };

      //create delegate reference to link with slider
      $scope.data.sliderDelegate = null;

      //watch our sliderDelegate reference, and use it when it becomes available
      $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
        if (newVal != null) {
          $scope.data.sliderDelegate.on('slideChangeEnd', function () {
            $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
            //use $scope.$apply() to refresh any content external to the slider
            $scope.$apply();
          });
        }
      });
    };




    $scope.gettingBanners = true;



    $scope.images = [];

    $scope.slickConfig = {
      //enabled: true,
      //autoplay: false,
      //draggable: true,  
      // method: {},
      arrows: false,
      //centerMode:true,
      //variableWidth: true,
    };


    $http({
      method: 'GET',
      url: 'http://medappteka.uz/api/banner'
    }).success(function (data) {
      //$scope.images = [];
      $timeout(function () {
        $scope.images = data.data;
        console.log($scope.banners);
        $scope.gettingBanners = false;
        /* $(".banner-class").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          speed: 500,
          fade: true,
          cssEase: 'linear'
        });
*/
        // $(".banners-getting").css('opacity', '1')
      }, 2000)

    }).error(function (err) {
      $scope.gettingBanners = false;
      $ionicLoading.show({
        template: 'Ошибка сети',
        noBackdrop: true,
        duration: 2000
      });
    });




    var specialization_url = 'http://medappteka.uz/api/inst/specializations';
    $http({
      method: 'GET',
      url: specialization_url
    }).success(function (data) {
      $scope.specializations = data.data;
      /* console.log($scope.specializations)*/
    }).error(function (err) {
      $ionicLoading.show({
        template: "{{'slow_internet' | translate}}",
        noBackdrop: true,
        duration: 2000
      });
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

    $scope.submitSearch = function (searchPlace) {
      /* console.log('searchPlace', searchPlace)*/
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
      if ($scope.active == 'medicine') {
        var search_med = {
          query: $rootScope.selectedMedicine.name
        }
        if (searchPlace == undefined || searchPlace == '') {
          delete search_med["district_id"];
        } else {
          /*console.log(searchPlace == undefined)*/
          search_med["district_id"] = searchPlace.id;
        }
        console.log(search_med)
        $http({
          method: 'POST',
          url: 'http://medappteka.uz/api/medicine/search',
          data: Object.toparams(search_med),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).success(function (data) {
          if (data.data.length) {
            console.log('data', data)
            $rootScope.pharmacies = data.data;
          } else {
            $rootScope.pharmacies = [];
          }
          $timeout(function () {
            $state.go('app.medicines', {}, {
              reload: 'app.medicines'
            });
            $ionicLoading.hide();
          }, 500)
        }).error(function (err, a, b, c) {
          console.log(err, a, b, c);
          $ionicLoading.hide();
          $ionicLoading.show({
            template: "{{'slow_internet' | translate}}",
            noBackdrop: true,
            duration: 2000
          });
        });
      } else {
        var search_cli = {
          query: $rootScope.selectedClinic.name
        }
        if (searchPlace == undefined || searchPlace == '') {
          delete search_cli["district_id"];
        } else {
          search_cli["district_id"] = searchPlace.id;
        }
        $http({
          method: 'POST',
          url: 'http://medappteka.uz/api/inst/search-by-spec',
          data: Object.toparams(search_cli),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).success(function (data) {
          if (data.data.length) {
            $rootScope.clinics = data.data;
          } else {
            $rootScope.clinics = [];
          }
          $rootScope.clinics = data.data;
          $ionicLoading.hide();
          $state.go('app.clinics');
        }).error(function (err, a, b, c) {
          /*console.log(err, a, b, c);*/
          $ionicLoading.hide();
          $ionicLoading.show({
            template: "{{'slow_internet' | translate}}",
            noBackdrop: true,
            duration: 2000
          });
        });
      }
    }

    //$http.get('http://medappteka.uz/api/cart').success(handleSuccess);

  }).directive('slick', [
  '$timeout',
  function ($timeout) {
      return {
        restrict: 'AEC',
        scope: {
          initOnload: '@',
          data: '=',
          currentIndex: '=',
          accessibility: '@',
          adaptiveHeight: '@',
          arrows: '@',
          asNavFor: '@',
          appendArrows: '@',
          appendDots: '@',
          autoplay: '@',
          autoplaySpeed: '@',
          centerMode: '@',
          centerPadding: '@',
          cssEase: '@',
          customPaging: '&',
          dots: '@',
          draggable: '@',
          easing: '@',
          fade: '@',
          focusOnSelect: '@',
          infinite: '@',
          initialSlide: '@',
          lazyLoad: '@',
          onBeforeChange: '&',
          onAfterChange: '&',
          onInit: '&',
          onReInit: '&',
          onSetPosition: '&',
          pauseOnHover: '@',
          pauseOnDotsHover: '@',
          responsive: '=',
          rtl: '@',
          slide: '@',
          slidesToShow: '@',
          slidesToScroll: '@',
          speed: '@',
          swipe: '@',
          swipeToSlide: '@',
          touchMove: '@',
          touchThreshold: '@',
          useCSS: '@',
          variableWidth: '@',
          vertical: '@',
          prevArrow: '@',
          nextArrow: '@'
        },
        link: function (scope, element, attrs) {
          var destroySlick, initializeSlick, isInitialized;
          destroySlick = function () {
            return $timeout(function () {
              var slider;
              slider = $(element);
              slider.slick('unslick');
              slider.find('.slick-list').remove();
              return slider;
            });
          };
          initializeSlick = function () {
            return $timeout(function () {
              var currentIndex, customPaging, slider;
              slider = $(element);
              if (scope.currentIndex != null) {
                currentIndex = scope.currentIndex;
              }
              customPaging = function (slick, index) {
                return scope.customPaging({
                  slick: slick,
                  index: index
                });
              };
              slider.slick({
                accessibility: scope.accessibility !== 'false',
                adaptiveHeight: scope.adaptiveHeight === 'true',
                arrows: scope.arrows !== 'false',
                asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
                appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
                appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
                autoplay: scope.autoplay === 'true',
                autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
                centerMode: scope.centerMode === 'true',
                centerPadding: scope.centerPadding || '50px',
                cssEase: scope.cssEase || 'ease',
                customPaging: attrs.customPaging ? customPaging : void 0,
                dots: scope.dots === 'true',
                draggable: scope.draggable !== 'false',
                easing: scope.easing || 'linear',
                fade: scope.fade === 'true',
                focusOnSelect: scope.focusOnSelect === 'true',
                infinite: scope.infinite !== 'false',
                initialSlide: scope.initialSlide || 0,
                lazyLoad: scope.lazyLoad || 'ondemand',
                beforeChange: attrs.onBeforeChange ? scope.onBeforeChange : void 0,
                onReInit: attrs.onReInit ? scope.onReInit : void 0,
                onSetPosition: attrs.onSetPosition ? scope.onSetPosition : void 0,
                pauseOnHover: scope.pauseOnHover !== 'false',
                responsive: scope.responsive || void 0,
                rtl: scope.rtl === 'true',
                slide: scope.slide || 'div',
                slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
                slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
                speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
                swipe: scope.swipe !== 'false',
                swipeToSlide: scope.swipeToSlide === 'true',
                touchMove: scope.touchMove !== 'false',
                touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
                useCSS: scope.useCSS !== 'false',
                variableWidth: scope.variableWidth === 'true',
                vertical: scope.vertical === 'true',
                prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
                nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0
              });
              slider.on('init', function (sl) {
                if (attrs.onInit) {
                  scope.onInit();
                }
                if (currentIndex != null) {
                  return sl.slideHandler(currentIndex);
                }
              });
              slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                if (scope.onAfterChange) {
                  scope.onAfterChange();
                }
                if (currentIndex != null) {
                  return scope.$apply(function () {
                    currentIndex = currentSlide;
                    return scope.currentIndex = currentSlide;
                  });
                }
              });
              return scope.$watch('currentIndex', function (newVal, oldVal) {
                if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                  return slider.slick('slickGoTo', newVal);
                }
              });
            });
          };
          if (scope.initOnload) {
            isInitialized = false;
            return scope.$watch('data', function (newVal, oldVal) {
              if (newVal != null) {
                if (isInitialized) {
                  destroySlick();
                }
                initializeSlick();
                return isInitialized = true;
              }
            });
          } else {
            return initializeSlick();
          }
        }
      };
  }
]);