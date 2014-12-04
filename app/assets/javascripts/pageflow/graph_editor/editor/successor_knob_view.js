/*globals d3, graphEditor*/

graphEditor.successorKnobView = graphEditor.D3View(function(svg) {
  var r = 10;
  var successorKnobItem = graphEditor.pageMenuItem('successor-knob')
      .transform(function (d) { return "translate(0," + (options.page.height / 2) + ")";})
      .element('svg:circle');

  svg.enter = function(node, opts, parentNode) {
    successorKnobItem.enter(node, parentNode)
        .presentation(function () {
          this.attr("r", r);
        })
        .dummy(function () {
          this.attr("r", r);
        })
        .drag(function () {
          this.dropTarget('page')
              .dropped(opts.droppedOnPage);
        });
  };

  svg.exit = function(node) {
    successorKnobItem.exit(node);
  };
});
