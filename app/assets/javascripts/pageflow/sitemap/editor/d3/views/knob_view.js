/*global sitemap, d3*/
sitemap.knobView = sitemap.D3View(function(svg) {
  var y = d3.scale.linear().domain([1,3]).range([-20, 15]);
  var h = 20;

  var knobItem = sitemap.pageMenuItem('knob')
      .transform(function (d, i) { return "translate(" + 30 + "," + y(i+1) + ")";});

  svg.enter = function(node, opts, parentNode) {
    knobItem.enter(node, parentNode)
        .presentation(function () {
          this
              .attr("width", 20)
              .attr("height", h)
              .classed("exceeded", function (d) { return d.exceeded; });
        })
        .dummy(function () {
          this
              .attr("width", 20)
              .attr("height", h);
        })
        .drag(function () {
          this.dropTarget('page')
              .dropped(opts.droppedOnPage);
        });
  };

  svg.exit = function(node) {
    knobItem.exit(node);
  };
});
