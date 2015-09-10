"use strict";
var d3sbControllers = angular.module('d3sbControllers', []);

d3sbControllers.controller('globalCtrl', ['$scope', function($scope){

}]);

d3sbControllers.controller('arcCtrl', ['$scope', function($scope){
  $scope.values = {
    'main': 70,
    'min': 30,
    'expected': 40
  };
  console.log($scope.values);
}]);