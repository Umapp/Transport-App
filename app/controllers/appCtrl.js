angular.module('starter')

.controller('AppCtrl', function($scope, $ionicModal, User, Drivers, $window, $state, DATABASE, $ionicHistory, $cordovaGeolocation) {

  var ref = new Firebase(DATABASE.FIREBASE);


  $scope.lat = '';
  $scope.long = '';
  
  $scope.currentuser;

  var posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };

  setInterval(function() {
    $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function(position) {
          Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
          $scope.lat = position.coords.latitude;
          $scope.long = position.coords.longitude;

          console.log($scope.lat, $scope.long);

        },
        function(err) {
          // error
        });
  }, 5000);

  $scope.logout = function() {

    $ionicHistory.clearCache().then(function() {
      ref.unauth();
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
