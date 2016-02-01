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
