angular.module('starter')

.controller('AppCtrl', function($scope, $ionicModal, User, Drivers, $window, $state, DATABASE, $ionicHistory, $cordovaGeolocation, $rootScope, $ionicPlatform, $timeout) {

  var ref = new Firebase(DATABASE.FIREBASE);


  $scope.lat = '';
  $scope.long = '';

  var posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };
  setInterval(function() {
    if ($ionicPlatform.ready) {
      if ($rootScope.currentuser) {
        $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(function(position) {
              Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
              $scope.lat = position.coords.latitude;
              $scope.long = position.coords.longitude;
              console.log(position);
            },
            function(err) {
              // error
            });
      }
    }
  }, 5000);

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
      $state.go('signin');
    });
  };

});
