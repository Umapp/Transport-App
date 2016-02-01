angular.module('starter')
  .controller('loginCtrl', function($scope, DATABASE, $ionicPopup, $http, $state, $timeout) {

    var ref = new Firebase('https://blistering-heat-9110.firebaseio.com/');

    $scope.login = function(user) {
      console.log('Logging in');
      $http.post('http://transport-umapp.herokuapp.com/api/authenticate', {
        name: user.username,
        password: user.password
      }).then(function(res) {
          if (res.data.success === true) {
            ref.authWithCustomToken(res.data.token, function(error, authData) {
              if (error) {
                console.log("Authentication Failed!", error);
              } else {
                console.log("Authenticated successfully:", authData);
                  //$rootScope.loggedInUser = authData.auth.user;
                  $state.go('app.tasks');
              }
            }, {
              remember: "default"
            });
          } else {
            console.log(res.data.message);
            $scope.errorMessage = "Du har antingen angivit felaktiga inloggningsuppgifter eller så har din användare inaktiverats.";
          }
        }, function(err) {
          console.log("Authentication server error: " + err);
        }

      );
    };
  });
