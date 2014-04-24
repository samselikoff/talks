d3.charts = d3.charts || {};

d3.charts.bubble = function() {

  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      diameter = 400,
      format = d3.format(",d"),
      color = d3.scale.category10(),
      bubble = d3.layout.pack()
        .sort(null)
        .size([diameter-margin.left, diameter-margin.top])
        .padding(1.5),
      emptyMessage = 'No data',
      nodes;

  function chart(selection) {
    selection.each(function(data) {

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([
        bubble.nodes(classes(data)).filter(function(d) {return !d.children;})
      ]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      // Update the outer dimensions.
      svg.attr("width", diameter)
          .attr("height", diameter);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      if (!data.children.length) {
        g.html('')
          .append('text')
          .attr('class', 'message')
          .text(emptyMessage);
        return false;
      } else {
        g.select('.message').remove();
      }

      /* Nodes
      ************/
      nodes = svg.select('g').selectAll(".node")
          .data(function(d) { return d; }, function(d) {return d.className;});

      // Enter
      var nodesEnter = nodes.enter()
          .append("g")
          .attr("class", "node");

      nodesEnter.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });
      nodesEnter.append("circle")
        .style("fill", function(d) { return '#FF9C4F'; })
        .attr("r", 0);
      nodesEnter.append("text");


      // Merge
      var nodesMerge = nodes.transition().duration(200)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      nodesMerge.select("circle")
        .attr("r", function(d) { return d.r; });
      nodesMerge.select('text')
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.className.substring(0, d.r / 4); });

      // Exit
      var nodesExit = nodes.exit().transition().duration(200);

      nodesExit.select("circle").attr('r', 0);
      nodesExit.select("text").attr('opacity', 0);
      nodesExit.remove();

    });
  }

  function classes(root) {
    var _classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else _classes.push({packageName: name, className: node.name, value: node.size});
    }

    recurse(null, root);
    return {children: _classes};
  }

  /*
    Enhancement
  */
  chart.selectItem = function(index) {
    nodes.classed('active', function(d, i) {
      return i === index;
    });
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;

    margin = _;
    bubble.size([diameter-margin.left, diameter-margin.top]);

    return chart;
  };

  chart.emptyMessage = function(_) {
    if (!arguments.length) return emptyMessage;

    emptyMessage = _;

    return chart;
  };

  return chart;
};