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
