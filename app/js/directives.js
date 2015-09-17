"use strict";
var d3sbDirectives = angular.module('d3sbDirectives', []);

//arcs regular
d3sbDirectives.directive('arcRegular', [function(){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      var width = elem[0].offsetWidth,
          height = width,
          radius = height / 2 - 10,
          pi = Math.PI,
          rotateAngle = 1.1*180;

      var data = Object.keys(scope.values).map(function (key) {return parseInt(scope.values[key])});
      
      var myScale = d3.scale.linear().domain([0, 100]).range([0, 1.8 * Math.PI]);
      
      var svg = d3.select(elem[0]).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");  
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
          
      
        
      scope.$watch('values',function(){
        var data = Object.keys(scope.values).map(function (key) {return parseInt(scope.values[key])});
        svg.selectAll("path")
          .data(pie(data))
          .attr("d", arc);
        

        }, true);
    }
  }
}]);

//arcs overlapping
d3sbDirectives.directive('arcOverlapping', [function(){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      var width = elem[0].offsetWidth,
          height = width,
          radius = height / 2 - 10,
          pi = Math.PI,
          rotateAngle = 1.1*180;

      var myScale = d3.scale.linear().domain([0, 100]).range([0, 1.8 * Math.PI]);
      
      var svg = d3.select(elem[0]).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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
          
      scope.$watch('values',function(){
        arcMain.endAngle(myScale(scope.values.main));        
        svg.select('#pathMain').attr("d", arcMain);
        
        arcMin.endAngle(myScale(scope.values.min));        
        svg.select('#pathMin').attr("d", arcMin);

        arcExpected.endAngle(myScale(scope.values.expected));        
        svg.select('#pathExpected').attr("d", arcExpected);
        }, true);
    }
  }
}]);

//geo
d3sbDirectives.directive('geoOrthographic', [function(){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      var width = elem[0].offsetWidth,
          height = width,
          mapsize = 200; //apparently set by d3.geo.orthographic
      
      var graticule = d3.geo.graticule();
      
      var projection = d3.geo.orthographic()
        .scale(((Math.min(width, height) - 2)/mapsize)*100) //fit to container
        .translate([width / 2, height / 2])
        .clipAngle(90)
        .precision(.1);
      
      var path = d3.geo.path()
        .projection(projection);
            
      var svg = d3.select(elem[0])
        .append("svg")
        .attr({width:width, height:height})
        //.append("g")
        .attr("id", "map_ortho");
      
      /*svg.append("defs").append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere")
        .attr("d", path);

      svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

      svg.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");
    
      svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);*/
    
      d3.json("data/world.json", function(json) {
        svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("class","land");
        });
      
      var rotation = [0, 0, 0];
      var rotationspeed = 0.5
      var drag = d3.behavior.drag().on("drag", dragrotate);
      svg.call(drag);     
      function dragrotate() {
        rotation[0] = rotation[0] + d3.event.dx*rotationspeed;
        rotation[1] = rotation[1] - d3.event.dy*rotationspeed;
        projection.rotate(rotation);
        svg.selectAll("path").attr("d", path);
      };
    }
  }
}]);