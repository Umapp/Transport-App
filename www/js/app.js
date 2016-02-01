// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase'])

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
  .constant("DATABASE", {
    "FIREBASE": "https://blistering-heat-9110.firebaseio.com/",
    "SESSION": "firebase:session::blistering-heat-9110"
  })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('signin', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'

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
    .state('app.detail', {
      url: '/tasks/:taskId',
      views: {
        'menuContent': {
          templateUrl: 'templates/task.html',
          controller: 'TaskCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

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

angular.module('starter')
  .controller('loginCtrl', function($scope, DATABASE, $ionicPopup, $http, $state, $timeout) {

    var ref = new Firebase('https://blistering-heat-9110.firebaseio.com/');

    $scope.login = function(user) {
      console.log('Logging in');
      $http.post('http://transport-umapp.herokuapp.com/api/authenticate', {
        name: user.username,
        password: user.password
      }).then(function(res) {
          if (res.data.success === true) {
            ref.authWithCustomToken(res.data.token, function(error, authData) {
              if (error) {
                console.log("Authentication Failed!", error);
              } else {
                console.log("Authenticated successfully:", authData);
                  //$rootScope.loggedInUser = authData.auth.user;
                  $state.go('app.tasks');
              }
            }, {
              remember: "default"
            });
          } else {
            console.log(res.data.message);
            $scope.errorMessage = "Du har antingen angivit felaktiga inloggningsuppgifter eller så har din användare inaktiverats.";
          }
        }, function(err) {
          console.log("Authentication server error: " + err);
        }

      );
    };
  });

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

angular.module('starter')
  .controller('TaskListCtrl', function($scope, Tasks, $ionicPopup) {
    $scope.tasks = Tasks.getAllTasks();
    
  });

angular.module('starter')
.factory('Tasks', function($firebaseArray, $firebaseObject, User){
  var org = User.getLoggedInOrganization();
  var tasksRef = new Firebase('https://blistering-heat-9110.firebaseio.com/'+ org + '/tasks');

  this.getAllTasks = function () {

      //console.log('TASKSREF=' + org);
      return $firebaseArray(tasksRef);
  };

  this.getCurrentTask = function (task) {
      var ref = new Firebase(tasksRef + '/' + task.$id);
      return $firebaseObject(ref);
  };

  this.getTask = function(id){
    var ref = new Firebase(tasksRef + '/' + id);
    return $firebaseObject(ref);
  };

  return this;
});

angular.module('starter')
  .factory('User', function(DATABASE) {

    this.getLoggedInUser = function() {
      var user = localStorage.getItem(DATABASE.SESSION);
      if (user) {
        return JSON.parse(user);
      }
    };

    this.getLoggedInOrganization = function() {
      var parsed = JSON.parse(localStorage.getItem(DATABASE.SESSION));
      var organization = parsed.auth.organization;
      if (organization) {
        return organization;
      }
    };

    return this;
  });
