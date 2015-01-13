/*globals d3, sitemap*/

sitemap.successorKnobView = sitemap.D3View(function(svg) {
  var r = 10;
  var successorKnobItem = sitemap.pageMenuItem('successor-knob')
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
        })
        .click(function() {
          if (opts.clicked) {
            opts.clicked();
          }
        });
  };

  svg.exit = function(node) {
    successorKnobItem.exit(node);
  };
});
