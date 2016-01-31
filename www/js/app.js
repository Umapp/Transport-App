// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.tasks', {
      url: '/tasks',
      views: {
        'menuContent': {
          templateUrl: 'templates/tasks.html',
          controller: 'TaskListCtrl'
        }
      }
    })
    .state('app.task.detail', {
      url: '/tasks/:taskId',
      vtemplateUrl: 'templates/task.html',
      controller: 'TaskCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tasks');
});

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

  };
});

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

angular.module('starter.controllers')
.factory('Tasks', function($firebaseArray, $firebaseObject){
  var tasksRef = new Firebase('https://blistering-heat-9110.firebaseio.com/hi5/tasks');

  this.getAllTasks = function () {
      return $firebaseArray(tasksRef);
  };

  this.getCurrentTask = function (task) {
      var ref = new Firebase('https://blistering-heat-9110.firebaseio.com/hi5/tasks/' + task.$id);
      return $firebaseObject(ref);
  };

  return this;
});
