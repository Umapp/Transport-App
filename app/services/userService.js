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
