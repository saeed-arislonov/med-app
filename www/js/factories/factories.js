angular.module('starter.factories', [])
	.factory('orderCount', function ($http) {

		return {
			total: "",
			orderCount: function () {
				$http.get('../data/cart.json')
					.success(function (data) {
						return data.length
					})
			},
			updateCount: function () {
				return $http.get('../data/cart.json');
			}
		}

	})
	.factory('singleMap', function () {
		return {
			selectedClinicMap: "",
			selectedClinicName: ""
		}
	})
	.service('IonicClosePopupService', [
            function () {
			var currentPopup;
			var htmlEl = angular.element(document.querySelector('html'));
			htmlEl.on('click', function (event) {
				if (event.target.nodeName === 'HTML') {
					if (currentPopup) {
						currentPopup.close();
					}
				}
			});

			this.register = function (popup) {
				currentPopup = popup;
			}
            }
        ])
	.factory('sessionService', ['$http', function ($http) {
		return {
			set: function (key, value) {
				return localStorage.setItem(key, JSON.stringify(value));
			},
			get: function (key) {
				return JSON.parse(localStorage.getItem(key));
			},
			destroy: function (key) {
				return localStorage.removeItem(key);
			},
		};
    }])
	.factory('Auth', function () {
		if (window.localStorage['session']) {
			var _user = JSON.parse(window.localStorage['session']);
		}
		var setUser = function (session) {
			_user = session;
			window.localStorage['session'] = JSON.stringify(_user);
		}
		var setRegisterToken = function (regToken) {
			//_regToken = regToken;
			window.localStorage['registerToken'] = JSON.stringify(regToken);
		}

		return {
			userInfo: {},
			setUserPhone: "",
			setRegisterToken: setRegisterToken,
			getRegisterToken: function () {
				return JSON.parse(window.localStorage['registerToken'])
			},
			userId: "",
			setUser: setUser,
			isLoggedIn: function () {
				return _user ? true : false;
			},
			getUser: function () {
				return _user;
			},
			logout: function () {
				window.localStorage.removeItem("session");
				window.localStorage.removeItem("list_dependents");
				_user = null;
			}
		}
	})
	.service('postService', function ($http) {
		this.uploadFileToUrl = function (name, phone, photo, birth_date, email, login, password) {
			var fd = new FormData();

			fd.append('name', name);
			fd.append('phone', phone);
			fd.append('photo', photo);
			fd.append('birth_date', birth_date);
			fd.append('email', email);
			fd.append('login', login);
			fd.append('password', password);

			return $http({
				url: 'http://medappteka.uz/api/user/sign-up',
				method: 'POST',
				data: fd,
				//assign content-type as undefined, the browser
				//will assign the correct boundary for us
				headers: {
					'Content-Type': undefined
				},
				//prevents serializing payload.  don't do it.
				transformRequest: angular.identity
			});
		}
	})