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

var successorPathView = sitemap.D3View(function(svg) {
  svg.enter = function(node, opts) {
    node.insert("path", "g")
      .attr("class", 'successor')
      .attr("id", svg.idfunc)
      .attr("marker-end", "url(#Triangle)")
      .call(applyHighlight)
      .call(addClicked, opts)
      .transition()
        .attr("d", sitemap.linkpath)
      .transition()
        .attr("d", sitemap.linkpath);
  };

  svg.update = function(node) {
    node.transition().duration(window.options.duration)
     .attr("d", sitemap.linkpath);
  };
});

var placeholdersView = sitemap.D3View(function(svg) {
  var w = window.options.page.width,
      h = window.options.page.height;

  svg.enter = function(node, opts) {
    node.append("svg:rect")
      .attr('class', 'placeholder')
      .call(svg.size, w, h)
      .attr("transform", function(d) { return "translate(" + (d.x - w / 2) + "," + (d.y - h / 2) + ")"; })
      .call(addClicked, opts)
      .on('mouseover.hover', function() {
        d3.select(this).classed('hover', true);
      })
      .on('mouseout.hover', function() {
        d3.select(this).classed('hover', false);
      })
    ;
  };
});
