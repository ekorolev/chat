//= ../../bower_components/angular/angular.min.js
//= ../../bower_components/angular-route/angular-route.min.js
//= ../../bower_components/angular-cookies/angular-cookies.min.js

const socket = io.connect("/");
const App = angular.module("App", ["ngRoute", "ngCookies"]);
let User = {
	auth: false
};

App.config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	$routeProvider
	.when("/", {
		templateUrl: "/templates/chat.html",
		controller: "ChatController"
	})
	.when("/login", {
		templateUrl: "/templates/login.html",
		controller: "LoginController"
	})
}]);

App.controller("MainController", function ($scope, $location) {

	$location.path("/login");

});

App.controller("ChatController", function ($scope) {
	$scope.messages = [];

	$scope.send = function (text) {
		socket.emit("message", {
			author: User.nickname,
			text: text
		});
	}

	socket.on("message", function (data) {
		$scope.messages.push(data);
		$scope.$apply();
	});
});

App.controller("LoginController", function ($scope, $location, $cookies) {

	let cookieName = $cookies.get("nickname");
	if (cookieName) {
		User.nickname = cookieName;
		socket.emit("mynameis", cookieName);
		$location.path("/");
	}

	$scope.login = function (nickname) {
		User.nickname = nickname;
		socket.emit("mynameis", nickname);
		$cookies.put("nickname", nickname);
		$location.path("/");
	};
});

App.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});