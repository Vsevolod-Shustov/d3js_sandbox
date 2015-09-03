"use strict";
var d3sbDirectives = angular.module('d3sbDirectives', []);

d3sbDirectives.directive('arcDirective', ['$compile', function($compile){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      var width = 960,
          height = 500,
          radius = height / 2 - 10,
          pi = Math.PI,
          rotateAngle = 1.1*180;

      var myScale = d3.scale.linear().domain([0, 100]).range([0, 1.8 * Math.PI]);
      
      var svg = d3.select("#content").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        scope.$watch('values',function(){
        //main
        svg.select("g #pathMain").remove();
        svg.select("g #pathMin").remove();
        svg.select("g #pathExpected").remove();
        
        var arcMain = d3.svg.arc()
          .innerRadius(radius - 40)
          .outerRadius(radius)
          //.cornerRadius(20)
          .startAngle(myScale(0))
          .endAngle(myScale(scope.values.main));
        
        var arcMin = d3.svg.arc()
          .innerRadius(radius - 45)
          .outerRadius(radius - 35)
          .cornerRadius(10)
          .startAngle(myScale(0))
          .endAngle(myScale(scope.values.min));
          
        var arcExpected = d3.svg.arc()
            .innerRadius(radius - 5)
            .outerRadius(radius + 5)
            .cornerRadius(10)
            .startAngle(myScale(0))
            .endAngle(myScale(scope.values.expected));
         
        //main
        svg.append("path")
          .attr("id", "pathMain")
          .style("fill", "#f39c12")
          .attr("d", arcMain)
          .attr("transform", "rotate("+rotateAngle+" 0 0)");
        
        //min
        svg.append("path")
          .attr("id", "pathMin")
          .style("fill", "#3498db")
          .attr("d", arcMin)
          .attr("transform", "rotate("+rotateAngle+" 0 0)");

        //expected
        svg.append("path")
          .attr("id", "pathExpected")
          .style("fill", "#e74c3c")
          .attr("d", arcExpected)
          .attr("transform", "rotate("+rotateAngle+" 0 0)");
        }, true);
    }
  }
}]);