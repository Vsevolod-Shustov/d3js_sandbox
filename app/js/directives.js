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
      
      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");
      
      g.append("path")
        .style("fill", function(d, i) { return color[i]; })
        .attr("d", arc);      
      g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.value; });
        
      scope.$watch('values',function(){
        var data = Object.keys(scope.values).map(function (key) {return parseInt(scope.values[key])});
        //svg.selectAll("path").data(pie(data)).attr("d", arc);
        svg.selectAll(".arc path")
          .data(pie(data))
          .attr("d", arc);
        svg.selectAll(".arc text")
          .data(pie(data))
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .text(function(d) { return d.value; });
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
        svg.append("text")
          .attr("id", "textMain")
          .attr("dy", ".35em")
          .style({"text-anchor": "middle",
            "font-size": height/4,
            "fill": "#f39c12"})
          .text(scope.values.main);
        
        //min
        svg.append("path")
          .attr("id", "pathMin")
          .style("fill", "#3498db")
          .attr("d", arcMin)
          .attr("transform", "rotate("+rotateAngle+" 0 0)");
        svg.append("text")
          .attr("transform", "translate(0," + height / 6 + ")")
          .attr("id", "textMin")
          .attr("dy", ".35em")
          .style({"text-anchor": "middle",
            "font-size": height/8,
            "fill": "#3498db"})
          .text(scope.values.min);
          
        //expected
        svg.append("path")
          .attr("id", "pathExpected")
          .style("fill", "#e74c3c")
          .attr("d", arcExpected)
          .attr("transform", "rotate("+rotateAngle+" 0 0)");
        svg.append("text")
          .attr("transform", "translate(0," + -(height / 6) + ")")
          .attr("id", "textExpected")
          .attr("dy", ".35em")
          .style({"text-anchor": "middle",
            "font-size": height/8,
            "fill": "#e74c3c"})
          .text(scope.values.expected);
          
      scope.$watch('values',function(){
        arcMain.endAngle(myScale(scope.values.main));        
        svg.select('#pathMain').attr("d", arcMain);
        svg.select('#textMain').text(scope.values.main);
        
        arcMin.endAngle(myScale(scope.values.min));        
        svg.select('#pathMin').attr("d", arcMin);
        svg.select('#textMin').text(scope.values.min);

        arcExpected.endAngle(myScale(scope.values.expected));        
        svg.select('#pathExpected').attr("d", arcExpected);
        svg.select('#textExpected').text(scope.values.expected);
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
        .attr("id", "map_ortho");
      
      var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.properties.name; });
      svg.call(tip);
    
      d3.json("data/world.json", function(json) {
        svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("class","land")
          .on("click", function(d){
            console.log(d.properties.name);
          })
          .on('mouseover', function(d){
            d3.select(this).style("fill", "#2ecc71");
            tip.show(d);
          })
          .on('mouseout', function(d){
            d3.select(this).style("fill", "#222");
            tip.hide(d);
          });
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

//tree
d3sbDirectives.directive('tree', [function(){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      var data = [
        { "name" : "Level 2: A", "parent":"Top Level" },
        { "name" : "Top Level", "parent":"null" },
        { "name" : "Son of A", "parent":"Level 2: A" },
        { "name" : "Daughter of A", "parent":"Level 2: A" },
        { "name" : "Level 2: B", "parent":"Top Level" }
        ];
        
      var dataMap = data.reduce(function(map, node) {
        map[node.name] = node;
        //console.log(map);
        return map;
      }, {}); 
      
      var treeData = [];
      data.forEach(function(node) {
        // add to parent
        var parent = dataMap[node.parent];
        if (parent) {
          // create child array if it doesn't exist
          (parent.children || (parent.children = []))
            // add node to child array
            .push(node);
        } else {
          // parent is null or missing
          treeData.push(node);
        }
      });
      //console.log(treeData);
 
      var margin = {top: 40, right: 120, bottom: 20, left: 120},
        width = elem[0].offsetWidth - margin.right - margin.left,
        height = width/2 - margin.top - margin.bottom;
      
      var i = 0;

      var tree = d3.layout.tree()
        .size([height, width]);

      var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

      var svg = d3.select(elem[0]).append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var root = treeData[0];
        
      update(root);
      
      function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Declare the nodes.
        var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter the nodes.
        var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")"; });

        nodeEnter.append("circle")
          .attr("r", 10)
          .style("fill", "#fff");

        nodeEnter.append("text")
          .attr("x", function(d) { 
            return d.children || d._children ? -13 : 13; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { 
            return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1);

        // Declare the links.
        var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

        // Enter the links.
        link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", diagonal);

      }
    }
  }
}]);