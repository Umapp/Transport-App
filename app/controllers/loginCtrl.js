angular.module('starter')
    .controller('loginCtrl', function($scope, DATABASE, $ionicPopup, $http, $state, $timeout, $ionicLoading, $rootScope) {

        var ref = new Firebase(DATABASE.FIREBASE);

        var ProdSite = 'https://transport-umapp.herokuapp.com/api/authenticate'; 
        function loginError() {
            $ionicPopup.alert({
                title: 'Inloggning misslyckades',
                template: 'Kontrollera användarnamn och lösenord.'
            });
        }

        $scope.login = function(user, site) {
            auth = ProdSite;

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>',
                hideOnStageChange: true
            })
            console.log('Logging in');
            $http.post(auth, {
                name: user.username,
                password: user.password
            }).then(function(res) {
                if (res.data.success === true) {
                    ref.authWithCustomToken(res.data.token, function(error, authData) {
                        if (error) {
                            console.log("Authentication Failed!", error);
                            $ionicLoading.hide();
                            loginError();
                        }
                        else {
                            $ionicLoading.hide();
                            console.log("Authenticated successfully:", authData);
                            $rootScope.currentuser = authData.auth.name;
                            $state.go('app.tasks');

                        }
                    });
                }
                else {
                    console.log(res.data.message);
                    loginError();
                    $ionicLoading.hide();
                }
            }, function(err) {
                console.log("Authentication server error: " + err);
                loginError();
                $ionicLoading.hide();
            });
        };
    });
