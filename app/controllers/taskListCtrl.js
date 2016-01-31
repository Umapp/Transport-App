angular.module('starter')
  .controller('TaskListCtrl', function($scope, Tasks, $ionicPopup) {
    $scope.tasks = Tasks.getAllTasks();


    $scope.showConfirm = function(task) {
      var currentTask = Tasks.getCurrentTask(task);
      //var currentTask = Tasks.getCurrentTask(task);
      var confirmPopup = $ionicPopup.confirm({
        title: 'Kvittera jobb',
        template: 'Är du säker på att du vill kvittera jobbet?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          currentTask.receipted = true;
          currentTask.$save();
        } else {
          console.log('You are not sure');
        }
      });
    };
  });
