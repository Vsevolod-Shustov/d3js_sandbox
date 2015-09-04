"use strict";
var d3sbDirectives = angular.module('d3sbDirectives', []);

//overlapping
d3sbDirectives.directive('arcOverlapping', ['$compile', function($compile){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      var width = 450,
          height = 450,
          radius = height / 2 - 10,
          pi = Math.PI,
          rotateAngle = 1.1*180;

      var myScale = d3.scale.linear().domain([0, 100]).range([0, 1.8 * Math.PI]);
      
      var svg = d3.select("#arc_overlapping").append("svg")
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

//regular
d3sbDirectives.directive('arcRegular', ['$compile', function($compile){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      var width = 450,
          height = 450,
          radius = height / 2 - 10,
          pi = Math.PI,
          rotateAngle = 1.1*180;

      var myScale = d3.scale.linear().domain([0, 100]).range([0, 1.8 * Math.PI]);
      
      var svg = d3.select("#arc_regular").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
      scope.$watch('values',function(newData){
        var data = Object.keys(newData).map(function (key) {return parseInt(newData[key])});
        console.log(data);
        svg.selectAll("path").remove();
        
        var arc = d3.svg.arc()
          .innerRadius(radius - 40)
          .outerRadius(radius)
          .cornerRadius(20);

        var pie = d3.layout.pie()
          .padAngle(.02)
          .sort(null);

        var color = ["#f39c12", "#3498db", "#e74c3c"];
        
        svg.selectAll("path")
          .data(pie(data))
        .enter().append("path")
          .style("fill", function(d, i) { return color[i]; })
          .attr("d", arc);
        }, true);
    }
  }
}]);