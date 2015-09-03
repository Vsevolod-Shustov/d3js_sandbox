"use strict";
var d3sbControllers = angular.module('d3sbControllers', []);

d3sbControllers.controller('globalCtrl', ['$scope', 'LocalStorageService', '$location', function($scope, LocalStorageService, $location){

}]);

d3sbControllers.controller('arcCtrl', ['$scope', 'LocalStorageService', '$location', function($scope, LocalStorageService, $location){
  $scope.values = {
    'main': 70,
    'min': 30,
    'expected': 40
  };
  console.log($scope.values);
}]);