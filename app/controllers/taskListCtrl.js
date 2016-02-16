angular.module('starter')
    .controller('TaskListCtrl', function ($scope, Tasks, $ionicPopup, User) {
        $scope.tasks = Tasks.getAllTasks();
        $scope.loggedInUser = User.getLoggedInUser();
    });
