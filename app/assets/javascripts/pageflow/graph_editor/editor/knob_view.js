/*global graphEditor, d3*/
graphEditor.knobView = graphEditor.D3View(function(svg) {
  var y = d3.scale.linear().domain([1,3]).range([-20, 15]);
  var h = 20;

  var knobItem = graphEditor.pageMenuItem('knob')
      .transform(function (d, i) { return "translate(" + 30 + "," + y(i+1) + ")";});

  svg.enter = function(node, opts, parentNode) {
    knobItem.enter(node, parentNode)
        .presentation(function () {
          this
              .attr("width", 20)
              .attr("height", h)
              .classed("exceeded", function (d) { return d.knob.exceeded(); });
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
