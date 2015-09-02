"use strict";
var d3sbServices = angular.module('d3sbServices', []);

d3sbServices.service('LocalStorageService', ['$rootScope', function(){
  var service = {
    save: function(key, value){
      localStorage[key] = angular.toJson(value);
    },
    clear: function(key){
      delete localStorage[key];
    },
    load: function(key, value){
      if(localStorage[key]) {
        return angular.fromJson(localStorage[key]);
      } else {
        console.log("No save found, have mock data instead.");
        return mockdata;
      }
    }
  };
  return service;
}]);