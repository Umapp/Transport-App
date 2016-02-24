angular.module('starter')
    .factory('Drivers', function ($firebaseArray, $firebaseObject, User, $q) {
        var user = User.getLoggedInUser();
        var org = User.getLoggedInOrganization();

        var today = moment().format('YYYYMMDD');

        var ref = new Firebase('https://resplendent-fire-2851.firebaseio.com/' + org + '/drivers');
        var currentDriver = new Firebase('https://resplendent-fire-2851.firebaseio.com/' + org + '/drivers/' + user);
        var time = new Firebase('https://resplendent-fire-2851.firebaseio.com/' + org + '/times');

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
