angular.module('starter')
  .controller('TaskListCtrl', function($scope, Tasks, $ionicPopup) {
    $scope.tasks = Tasks.getAllTasks();


  });
