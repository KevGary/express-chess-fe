// app.controller('GlobalController', function ($scope, $http, $q, UserFactory, RandomUserFactory, $location, API_URL, $rootScope) {
//   $rootScope.logStatus = "logged out";
//   $scope.logout = function() {
//     UserFactory.logout();
//   }
// })

// app.controller('LandingController', function ($scope) {
//   $scope.msg = 'thug'
// })

// app.controller('LoginController', function ($scope, $http, $q, UserFactory, RandomUserFactory, $location, $rootScope) {
//   $scope.login = function(user) {
//     UserFactory.login(user).then(function success(response) {
//       console.log(response);
//       console.log('successful log in');
//       $location.path('/lobby');
//     }, handleError);
    
//   }
//   $scope.logout = function() {
//     UserFactory.logout();
//   }
//   function handleError(response) {
//     alert('Error: ' + response.data);
//   }
// })

// app.controller('RegisterController', function ($scope, $http, $q, UserFactory, RandomUserFactory, $location, API_URL, $rootScope) {
//   $scope.register = function(user) {
//     $http.post(API_URL + '/users',
//       {
//         "data": {
//           "type": "user",
//           "attributes": {
//             "name": user.name,
//             "email": user.email,
//             "password": user.password,
//             "token": null
//           }
//         }
//       }
//     )
//     UserFactory.register(user).then(function success(response) {
//       console.log(response);
//       console.log('successful log in');
//       $location.path('/lobby');
//     }, handleError);
//   }
//   $scope.logout = function() {
//     UserFactory.logout();
//   }
//   function handleError(response) {
//     alert('Error: ' + response.data);
//   }
// })

// app.controller('LobbyController', function ($scope) {
//   $scope.msg = 'thug'
// })

// app.controller('GameController', function ($scope) {
//   $scope.msg = 'thug'
// })

// app.controller('HistoryController', function ($scope) {
//   $scope.msg = 'thug'
// })

// app.controller('SocketController', function ($scope) {
  
// })