angular.module('starter')
.factory('Tasks', function($firebaseArray, $firebaseObject, User){
  var org = User.getLoggedInOrganization();
  console.log(org);
  var tasksRef = new Firebase('https://resplendent-fire-2851.firebaseio.com/'+ org + '/tasks');

  this.getAllTasks = function () {
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
