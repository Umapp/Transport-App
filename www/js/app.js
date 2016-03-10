// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'ngCordova'])

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
        "FIREBASE": "https://transport-produktion.firebaseio.com/",
        "SESSION": "firebase:session::transport-produktion"
    })
    .constant('SW_DELAY', 1000)



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
            })
            .state('app.time', {
                url: '/time',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/time.html',
                        controller: 'TimeCtrl'
                    }
                }
            })
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });

angular.module('starter')
    .constant("DATABASE", {
        "FIREBASE": "https://transport-produktion.firebaseio.com/",
        "SESSION": "firebase:session::transport-produktion"
    })
angular.module('starter')
    .controller('AppCtrl', function($scope, $ionicModal, User, Drivers, $window, $state, DATABASE, $ionicHistory, $cordovaGeolocation, $rootScope, $ionicPlatform, $interval) {

        var ref = new Firebase(DATABASE.FIREBASE);
        var processing = false;

        $scope.lat = '';
        $scope.long = '';

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };

        /*
        
            window.setInterval(getLoc(), 5000);
        



        function getLoc() {
            if (processing) return;
            processing = true;
            $cordovaGeolocation.getCurrentPosition().then(function(position) {
                processing = false;
                console.log(position);
                Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
                $scope.lat = position.coords.latitude;
                $scope.long = position.coords.longitude;
                console.log(position);
            });
        };
        */
        $ionicPlatform.ready(function() {
            $interval(function() {
                navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000, enableHighAccuracy: true });
            }, 5000)

        });

        function onSuccess(position) {
            Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
            $scope.message = position;
            $scope.lat = position.coords.latitude;
            $scope.long = position.coords.longitude;
            console.log(position);
        };

        function onError(position) {
            console.log(position)
        };

        /*
                //setInterval(function() {
                $ionicPlatform.ready(function() {
                    $cordovaGeolocation.getCurrentPosition(posOptions)
                        .then(function(position) {
                            console.log(position);
                            Drivers.setCurrentPosition(position.coords.latitude, position.coords.longitude);
                            $scope.lat = position.coords.latitude;
                            $scope.long = position.coords.longitude;
                            console.log(position);
                        },
                        function(err) {
                            // error
                        });
                });
        
                //}, 5000)
                */



        $scope.logout = function() {

            $ionicHistory.clearCache().then(function() {
                ref.unauth();
                $rootScope.currentuser = null;
                $window.localStorage.clear();
                $ionicHistory.clearCache();
                //now you can clear history or goto another state if you need
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go('signin', {}, { reload: true });
            });
        };

    });

angular.module('starter')
    .controller('loginCtrl', function($scope, DATABASE, $ionicPopup, $http, $state, $timeout, $ionicLoading, $rootScope) {

        var ref = new Firebase(DATABASE.FIREBASE);

        var ProdSite = 'https://transport-umapp.herokuapp.com/api/authenticate'; 
        function loginError() {
            $ionicPopup.alert({
                title: 'Inloggning misslyckades',
                template: 'Kontrollera användarnamn och lösenord.'
            });
        }

        $scope.login = function(user, site) {
            auth = ProdSite;

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>',
                hideOnStageChange: true
            })
            console.log('Logging in');
            $http.post(auth, {
                name: user.username,
                password: user.password
            }).then(function(res) {
                if (res.data.success === true) {
                    ref.authWithCustomToken(res.data.token, function(error, authData) {
                        if (error) {
                            console.log("Authentication Failed!", error);
                            $ionicLoading.hide();
                            loginError();
                        }
                        else {
                            $ionicLoading.hide();
                            console.log("Authenticated successfully:", authData);
                            $rootScope.currentuser = authData.auth.name;
                            $state.go('app.tasks');

                        }
                    });
                }
                else {
                    console.log(res.data.message);
                    loginError();
                    $ionicLoading.hide();
                }
            }, function(err) {
                console.log("Authentication server error: " + err);
                loginError();
                $ionicLoading.hide();
            });
        };
    });

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

angular.module('starter')
    .controller('TaskListCtrl', function ($scope, Tasks, $ionicPopup, User) {
        $scope.tasks = Tasks.getAllTasks();
        $scope.loggedInUser = User.getLoggedInUser();
    });

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

angular.module('starter')
    .factory('Drivers', function ($firebaseArray, $firebaseObject, User, $q, DATABASE) {
        var user = User.getLoggedInUser();
        var org = User.getLoggedInOrganization();

        var today = moment().format('YYYYMMDD');

        var ref = new Firebase(DATABASE.FIREBASE+ org + '/drivers');
        var currentDriver = new Firebase(DATABASE.FIREBASE + org + '/drivers/' + user);
        var time = new Firebase(DATABASE.FIREBASE + org + '/times');

        this.getAllDrivers = function () {
            return $firebaseArray(ref);
        };

        this.setCurrentPosition = function (lat, long) {
            currentDriver.child('position').child('lat').set(lat);
            currentDriver.child('position').child('long').set(long);
            currentDriver.child('position').child('timestamp').set(Firebase.ServerValue.TIMESTAMP);
        };

        this.getToday = function () {
            //var deferred = $q.defer();
            //var objToday = $firebaseArray(currentDriver.child('dates').child(today));
            var objToday = $firebaseObject(time.child(today).child(user))
            return objToday
            //deferred.resolve(objToday)
            //return deferred.promise;
        }

        this.checkIn = function () {
            time.child(today).child(user).child('checkin').set(moment().format('LTS'))
            //currentDriver.child('dates').child(today).child('checkin').set(moment().format('LTS'));
        };

        this.checkOut = function () {
            time.child(today).child(user).child('checkout').set(moment().format('LTS'))
            //currentDriver.child('dates').child(today).child('checkout').set(moment().format('LTS'));
        }

        return this;
    });

angular.module('starter')
    .factory('Tasks', function ($firebaseArray, $firebaseObject, User, DATABASE) {
        var org = User.getLoggedInOrganization();
        console.log(org);
        var tasksRef = new Firebase(DATABASE.FIREBASE + org + '/tasks');

        this.getAllTasks = function () {
            return $firebaseArray(tasksRef);
        };

        this.getCurrentTask = function (task) {
            var ref = new Firebase(tasksRef + '/' + task.$id);
            return $firebaseObject(ref);
        };

        this.getTask = function (id) {
            var ref = new Firebase(tasksRef + '/' + id);
            return $firebaseObject(ref);
        };

        return this;
    });

angular.module('starter')
    .factory('timeService', function () {
       // moment().locale('sv').format('LLL');
        this.getNow = function () {
            return moment().format('LT')
        }
        
        this.checkout = function(){
            return moment().format('LT')
        }
        return this;

    })
    
angular.module('starter')
  .factory('User', function(DATABASE) {
    this.getLoggedInUser = function() {
      var parsed = JSON.parse(localStorage.getItem(DATABASE.SESSION));
      var user = parsed.auth.name;
      if (user) {
        return user;
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
