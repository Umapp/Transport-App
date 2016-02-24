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
    