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
