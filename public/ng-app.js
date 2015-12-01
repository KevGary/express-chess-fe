var app = angular.module('app', ['ngRoute'], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('API_URL', 'http://localhost:3001');

app.controller('GlobalController', function ($scope, $http, $q, UserFactory, RandomUserFactory, $location) {
})

app.controller('LandingController', function ($scope) {
  $scope.msg = 'thug'
})

app.controller('RegisterController', function ($scope) {
  $scope.msg = 'thug'
})

app.controller('LoginController', function ($scope, $http, $q, UserFactory, RandomUserFactory, $location) {
  $scope.login = function(user) {
    UserFactory.login(user).then(function success(response) {
      console.log(response);
      console.log('successful log in');
      // $location.url('/dashboard');
      // $location.path('/dashboard');
    }, handleError);
    
  }
  $scope.logout = function() {
    UserFactory.logout();
    // localStorage.removeItem('id');
    // localStorage.removeItem('email');
  }
  function handleError(response) {
    alert('Error: ' + response.data);
  }
})

app.controller('LobbyController', function ($scope) {
  $scope.msg = 'thug'
})

app.controller('GameController', function ($scope) {
  $scope.msg = 'thug'
})

app.controller('HistoryController', function ($scope) {
  $scope.msg = 'thug'
})

app.factory('RandomUserFactory', function RandomUserFactory($http, API_URL) {
  'use strict';
  return {
    getUser: getUser
  };

  function getUser() {
    return $http.get(API_URL + '/random-user');
  }
});
app.factory('UserFactory', function UserFactory($http, $q, API_URL, AuthTokenFactory) {
  'use strict';
  return {
    login: login,
    logout: logout,
    getUser: getUser
  };

  function login(user){
    return $http.post(API_URL + '/login',
    {
      "user": user
    })
    .then(function success(response) {
      AuthTokenFactory.setToken(response.data.token);
      return response;
    });
  }

  function logout() {
    AuthTokenFactory.setToken();
    return null;
  }

  function getUser() {
    if(AuthTokenFactory.getToken()) {
      return $http.get('API_URL' + '/me')
    } else {
      return $q.reject({ data: 'client has no authorization '})
    }
  }
})
app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
  'use strict';
  var store = $window.localStorage;
  var key = 'auth-token';
  return {
    getToken: getToken,
    setToken: setToken
  };

  function getToken() {
    return store.getItem(key);
  }

  function setToken(token){
    if (token) {
      store.setItem(key, token);
    } else {
      store.removeItem(key);
    }
  }
})
app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
  return {
    request: addToken
  };

  function addToken(config) {
    var token = AuthTokenFactory.getToken();
    if(token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
})

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/partials/landing.html',
      controller: 'LandingController'
    })
    .when('/register', {
      templateUrl: '/partials/register.html',
      controller: 'RegisterController'
    }) 
    .when('/login', {
      templateUrl: '/partials/login.html',
      controller: 'LoginController'
    }) 
    .when('/lobby', {
      templateUrl: '/partials/lobby.html',
      controller: 'LobbyController'
    })
    .when('/game', {
      templateUrl: '/partials/game.html',
      controller: 'GameController'
    })
    .when('/history', {
      templateUrl: '/partials/history.html',
      controller: 'HistoryController'
    })      
    .when('/page-not-found', {
      templateUrl: '/partials/error.html'
    })
    .otherwise({
      redirectTo: '/page-not-found'
    });
  $locationProvider.html5Mode(true);
}]);



