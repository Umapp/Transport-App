angular.module('starter')
    .controller('loginCtrl', function ($scope, DATABASE, $ionicPopup, $http, $state, $timeout, $ionicLoading) {

        var ref = new Firebase('https://resplendent-fire-2851.firebaseio.com/');

        var DemoSite = 'http://transport-demo.herokuapp.com/api/authenticate';
        var ProdSite = 'http://transport-umapp.herokuapp.com/api/authenticate';

        var DemoFb = '';
        var ProdFb = '';

        $scope.options = [{
            name: 'Standard'
        }, {
                name: 'Demo'
            }];

        //$scope.site = 'Demo';

        function loginError() {
            $ionicPopup.alert({
                title: 'Inloggning misslyckades',
                template: 'Kontrollera användarnamn och lösenord.'
            });
        }

        $scope.login = function (user, site) {
            var auth, fb;

            if (site === 'Standard') {
                auth = ProdSite;
                //fb = ProdFb;
            } else {
                auth = DemoSite;
            }
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>',
                hideOnStageChange: true
                //template: 'Loggar in...'
            });
            console.log('Logging in');
            $http.post(auth, {
                name: user.username,
                password: user.password
            }).then(function (res) {
                if (res.data.success === true) {
                    ref.authWithCustomToken(res.data.token, function (error, authData) {
                        if (error) {
                            console.log("Authentication Failed!", error);
                            $ionicLoading.hide();
                            loginError();
                        } else {
                            $ionicLoading.hide();
                            console.log("Authenticated successfully:", authData);
                            $state.go('app.tasks');

                        }
                    }, {
                            remember: "default"
                        });
                } else {
                    console.log(res.data.message);
                    loginError();
                    $ionicLoading.hide();
                }
            }, function (err) {
                console.log("Authentication server error: " + err);
                loginError();
                $ionicLoading.hide();
            }

                );
        };

        $scope.loginDemo = function () {
            var fb;

            auth = DemoSite;

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>',
                hideOnStageChange: true
                //template: 'Loggar in...'
            });
            console.log('Logging in');
            $http.post(auth, {
                name: "Demo",
                password: "password"
            }).then(function (res) {
                if (res.data.success === true) {
                    ref.authWithCustomToken(res.data.token, function (error, authData) {
                        if (error) {
                            console.log("Authentication Failed!", error);
                            $ionicLoading.hide();
                            loginError();
                        } else {
                            $ionicLoading.hide();
                            console.log("Authenticated successfully:", authData);
                            $state.go('app.tasks');

                        }
                    }, {
                            remember: "default"
                        });
                } else {
                    console.log(res.data.message);
                    loginError();
                    $ionicLoading.hide();
                }
            }, function (err) {
                console.log("Authentication server error: " + err);
                loginError();
                $ionicLoading.hide();
            }

                );
        };
    });
