"use strict";
var d3sbApp = angular.module('d3sbApp', [
  'ngRoute',
  'd3sbControllers',
  'd3sbServices',
  'd3sbDirectives'
]);

d3sbApp.filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
        return result;
    };
});

d3sbApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
      redirectTo: '/home'
    }).
    when('/home', {
      templateUrl: 'partials/home.html'
    }).
    when('/dial', {
      templateUrl: 'partials/dial.html'
    }).
    when('/geo', {
      templateUrl: 'partials/geo.html'
    });
});

d3sbApp.filter('parseInt', function() {
  return function(input) {
    return parseInt(input);
  };
});