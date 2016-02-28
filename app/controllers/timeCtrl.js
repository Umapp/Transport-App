angular.module('starter')
    .controller('TimeCtrl', function ($scope, $ionicPopup, $state, $timeout, timeService, Drivers) {

        $scope.today = Drivers.getToday()
        $scope.now = moment().format();

        $scope.checkin = function () {
            Drivers.checkIn();
        }

        $scope.checkout = function () {
            Drivers.checkOut();
        }
    });
