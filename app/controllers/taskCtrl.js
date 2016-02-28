angular.module('starter')
    .controller('TaskCtrl', function ($scope, Tasks, $ionicPopup, $state, timeService) {

        $scope.task = Tasks.getTask($state.params.taskId);

        $scope.startTask = function () {
            $scope.task.started = true;
            $scope.task.started = timeService.getNow();
            $scope.task.$save();
        }

        $scope.startLoading = function () {
            $scope.task.startLoad = timeService.getNow();
            $scope.task.$save();
        }
        $scope.stopLoading = function () {
            $scope.task.stopLoad = timeService.getNow();
            $scope.task.$save();
        }
        $scope.startUnloading = function () {
            $scope.task.startUnload = timeService.getNow();
            $scope.task.$save();
        }
        $scope.stopUnloading = function () {
            $scope.task.stopUnload = timeService.getNow();
            $scope.task.$save();
        }

        $scope.showConfirm = function () {
            //var currentTask = Tasks.getCurrentTask(task);
            var confirmPopup = $ionicPopup.confirm({
                title: 'Kvittera körning',
                template: 'Är du säker på att du vill kvittera körningen?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    $scope.task.receipted = true;
                    $scope.task.stopped = timeService.getNow();
                    $scope.task.$save();
                    $state.go('app.tasks');
                } else {
                    console.log('You are not sure');
                }
            });
        };
    });
