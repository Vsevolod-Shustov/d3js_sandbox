"use strict";
var d3sbApp = angular.module('d3sbApp', [
  'ngRoute'
]);

d3sbApp.config(function($routeProvider) {
    $routeProvider.
    when('/', {
      redirectTo: '/home'
    }).
    when('/home', {
      templateUrl: 'partials/home.html'
    }).
    when('/bar', {
      templateUrl: 'partials/bar.html'
    }).
    when('/arc', {
      templateUrl: 'partials/arc.html'
    }).
    when('/geo', {
      templateUrl: 'partials/geo.html'
    });
});