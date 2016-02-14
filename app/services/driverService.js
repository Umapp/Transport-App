angular.module('starter')
  .factory('Drivers', function($firebaseArray, $firebaseObject, User) {
    var user = User.getLoggedInUser();
    var org = User.getLoggedInOrganization();
    var ref = new Firebase('https://resplendent-fire-2851.firebaseio.com/' + org + '/drivers');
    var currentDriver = new Firebase('https://resplendent-fire-2851.firebaseio.com/' + org + '/drivers/' + user);

    this.getAllDrivers = function() {
      return $firebaseArray(ref);
    };

    this.setCurrentPosition = function(lat, long) {
      currentDriver.child('position').child('lat').set(lat);
      currentDriver.child('position').child('long').set(long);
      currentDriver.child('position').child('timestamp').set(Firebase.ServerValue.TIMESTAMP);
    };

    return this;
  });
