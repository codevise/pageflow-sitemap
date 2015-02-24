/*global sitemap, d3*/
/*exported linkPathView, followPathView, placeholdersView, groupControlsView*/

var applyHighlight = function (selection) {
  selection
      .on('mouseover.highlight', function () {
        d3.select(this).classed('highlight', true);
      })
      .on('mouseout.highlight', function () {
        d3.select(this).classed('highlight', false);
      });
};

var addClicked = function (selection, opts) {
  selection
    .on("click", function (d) {
      if (opts.clicked) {
        opts.clicked.call(this, d);
      }
    });
};

var followPathView = sitemap.D3View(function(svg) {
  svg.enter = function(node, opts) {
    node.insert("path", "g")
      .attr("class", 'follow')
      .attr("id", svg.idfunc)
      .call(applyHighlight)
      .call(addClicked, opts)
      .transition()
        .attr("d", sitemap.short)
      .transition()
        .attr("d", sitemap.followPath);
  };

  svg.update = function(node) {
    node.transition().duration(window.options.duration)
     .attr("d", sitemap.followPath);
  };
});