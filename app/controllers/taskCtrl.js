angular.module('starter')
  .controller('TaskCtrl', function($scope, Tasks, $ionicPopup, $state) {

    $scope.task = Tasks.getTask($state.params.taskId);

    $scope.showConfirm = function() {
      //var currentTask = Tasks.getCurrentTask(task);
      var confirmPopup = $ionicPopup.confirm({
        title: 'Kvittera körning',
        template: 'Är du säker på att du vill kvittera körningen?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          $scope.task.receipted = true;
          $scope.task.$save();
          $state.go('app.tasks');
        } else {
          console.log('You are not sure');
        }
      });
    };
  });
