angular.module('starter')

.controller('AppCtrl', function($scope, $ionicModal, User, $window, $state, DATABASE, $ionicHistory) {

  var ref = new Firebase(DATABASE.FIREBASE);
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
