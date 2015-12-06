var app = angular.module('app', ['ngRoute', 'ngAnimate'], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('API_URL', 'http://localhost:3001');

app.controller('GlobalController', function ($scope, $q, UserFactory, RandomUserFactory, $location, API_URL, $rootScope, LoginStatus) {
  $rootScope.loginStatus = LoginStatus.getLoginStatusString();
  $rootScope.loginBoolean = LoginStatus.getLoginStatusBoolean();

  $scope.logout = function() {
    UserFactory.logout();
    LoginStatus.setLoginStatus(false);
  }
})

app.controller('LandingController', function ($scope) {
  $scope.msg = 'thug';
})

app.controller('LoginController', function ($scope, $q, UserFactory, RandomUserFactory, $location, $rootScope, LoginStatus) {
  $scope.login = function(user) {
    UserFactory.login(user).then(function success(response) {
      console.log(response);
      console.log('successful log in');
      $location.path('/lobby');
    }, handleError);
    LoginStatus.setLoginStatus(true);
  }
  $scope.logout = function() {
    UserFactory.logout();
    LoginStatus.setLoginStatus(false);
  }
  function handleError(response) {
    alert('Error: ' + response.data);
  }
})

app.controller('RegisterController', function ($scope, $q, UserFactory, RandomUserFactory, $location, API_URL, $rootScope, LoginStatus) {
  $scope.register = function(user) {
    UserFactory.register(user).then(function success(response) {
      console.log(response);
      console.log('successful log in');
      $location.path('/lobby');
    }, handleError);
    LoginStatus.setLoginStatus(true);
  }
  $scope.logout = function() {
    UserFactory.logout();
    LoginStatus.setLoginStatus(false);
  }
  function handleError(response) {
    alert('Error: ' + response.data);
  }
})

app.controller('LobbyController', function ($scope, Games) {
  $scope.allGames = Games.getAllGames();
  $scope.createGame = function() {
    Games.createGame();
  }
})

app.controller('GameController', function ($scope) {
  $scope.msg = 'thug'
})

app.controller('HistoryController', function ($scope) {
  $scope.msg = 'thug'
})

app.controller('SocketController', function ($scope) {
  
})

//JWT AUTH FACTORIES
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
    register: register,
    login: login,
    logout: logout,
    getUser: getUser
  };

  function register(user){
    return $http.post(API_URL + '/register',
    {
      "user": user
    })
    .then(function success(response) {
      $http.post(API_URL + '/users',
        {
          "data": {
            "type": "user",
            "attributes": {
              "name": user.name,
              "email": user.email,
              "password": user.password,
              "token": null
            }
          }
        }
      )
      return response;
    })
    .then(function success(response) {
      AuthTokenFactory.setToken(response.data.token);
      return response;
    });
  }

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
      return $http.get(API_URL + '/me')
    } else {
      return $q.reject({ data: 'client has no authorization '})
    }
  }
})
app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
  'use strict';
  var store = $window.localStorage;
  var key = 'auth_token';
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
//END JWT AUTH FACTORIES

//NAVBAR LOGINSTATUS FACTORIES
app.factory('LoginStatus', function LoginStatus($rootScope, $window) {
  var loggedIn = false;
  if($window.localStorage.auth_token){
    loggedIn = true;
  }

  return {
    getLoginStatusBoolean: getLoginStatusBoolean,
    getLoginStatusString: getLoginStatusString,
    setLoginStatus: setLoginStatus,
    setRootScope: setRootScope
  };

  function setRootScope() {
    $rootScope.loginStatus = getLoginStatusString();
    $rootScope.loginBoolean = getLoginStatusBoolean();
    console.log(getLoginStatusBoolean());
  }

  function getLoginStatusBoolean() {
    return loggedIn;
  }

  function getLoginStatusString() {
    return loggedIn == false ? 'Login': 'Logout';
  }

  function setLoginStatus(booleanInput) {
    if(typeof booleanInput != 'boolean') {
      return console.log('error setting login status, pass boolean');
    }
    loggedIn = booleanInput;
    setRootScope();
  }
})
//END LOGINSTATUS FACTORIES

//GAME FACTORIES
app.factory('Games', function CreateGame($q, $http, API_URL) {
  return {
    createGame: createGame,
    getAllGames: getAllGames
  }

  function createGame() {
    return $http.post(API_URL + '/games');
  }
  function getAllGames() {
    return $http.get(API_URL + '/games')
      .then(function success(response){
        return response;
      })
  }
});
//END GAME FACTORIES

//SOCKET FACTORIES
app.factory('Socket', function Socket($q, $http, API_URL, $rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
//END SOCKET FACTORIES


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
