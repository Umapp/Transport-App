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
