angular.module('starter')
  .controller('TaskCtrl', function($scope, Tasks, $ionicPopup, $stateParams) {

    $scope.task = Tasks.getCurrentTask($stateParams.task);

    $scope.showConfirm = function(task) {
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
