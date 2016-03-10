angular.module('starter')
    .controller('AppCtrl', function($scope, $ionicModal, User, Drivers, $window, $state, DATABASE, $ionicHistory, $cordovaGeolocation, $rootScope, $ionicPlatform, $interval) {

        var ref = new Firebase(DATABASE.FIREBASE);
        var processing = false;

        $scope.lat = '';
        $scope.long = '';

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };

        /*
        
            window.setInterval(getLoc(), 5000);
        



        function getLoc() {
            if (processing) return;
            processing = true;
            $cordovaGeolocation.getCurrentPosition().then(function(position) {
                processing = false;
                console.log(position);
                Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
                $scope.lat = position.coords.latitude;
                $scope.long = position.coords.longitude;
                console.log(position);
            });
        };
        */
        $ionicPlatform.ready(function() {
            $interval(function() {
                navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000, enableHighAccuracy: true });
            }, 5000)

        });

        function onSuccess(position) {
            Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
            $scope.lat = position.coords.latitude;
            $scope.long = position.coords.longitude;
            console.log(position);
        };

        function onError(position) {
            console.log(position)
        };

        /*
                //setInterval(function() {
                $ionicPlatform.ready(function() {
                    $cordovaGeolocation.getCurrentPosition(posOptions)
                        .then(function(position) {
                            console.log(position);
                            Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
                            $scope.lat = position.coords.latitude;
                            $scope.long = position.coords.longitude;
                            console.log(position);
                        },
                        function(err) {
                            // error
                        });
                });
        
                //}, 5000)
                */



        $scope.logout = function() {

            $ionicHistory.clearCache().then(function() {
                ref.unauth();
                $rootScope.currentuser = null;
                $window.localStorage.clear();
                $ionicHistory.clearCache();
                //now you can clear history or goto another state if you need
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('signin', {}, { reload: true });
            });
        };

    });
