/*global options*/

sitemap.chapterView = sitemap.d3View(function(view, u) {
  view.selector('g.group');

  view.enter = function (node, opts) {
    var representationNode = node.append('svg:g');

    var w = 90,
        barHeight = 10;

    var handleGroup = representationNode
        .append('svg:g')
        .attr('class', 'group-handle-group')
        .attr('transform', trBar)
        .on('mouseover', function() {
          d3.select(this.parentNode).classed('hover', true);
        })
        .on('mouseout', function() {
          d3.select(this.parentNode).classed('hover', false);
        })
        .on('click', function() {
          if (opts.clicked) {
            opts.clicked.apply(this, arguments);
          }
        })
        .on('mousedown', function() {
          if (opts.mousedown) {
            opts.mousedown.apply(this, arguments);
          }
        })
        ;

    handleGroup.append('svg:rect')
        .attr('class', 'group-handle')
        .attr('width', w)
        .attr('height', barHeight)
        ;

    handleGroup.append("foreignObject")
        .style('pointer-events', 'none')
        .attr('width', w)
        .attr('height', barHeight)
        // .attr('transform', trBar)
        .append("xhtml:body")
        .html(function(d){ return '<div class="pagetext">' + d.chapter.get('title') + '</div>'; })
        ;

    representationNode.append('svg:rect')
        .attr('class', 'group-highlight')
        .attr('width', w)
        .attr('height', function (d) { var h = d.height + 20; return h > 0 ? h : 0; })
        .attr('transform', trArea)
        ;

    representationNode.append('svg:rect')
        .attr('class', 'group-dummy')
        .attr('width', w)
        .attr('height', barHeight)
        .attr('transform', trBar);

    node.call(sitemap.behavior.multiDrag({
      drag: opts.drag,
      dragend: opts.dragend,
      handle: '.group-handle-group'
    }));
  };

  view.update = function(node) {
    function duration(d) {
      return d.dragged ? 0 : options.duration;
    }

    node.classed('selected', u.fn.d('selected'));
    node.classed('hover', u.fn.d('dragged'));

    node.select('.group-handle-group')
        .transition().duration(options.duration)
        .attr('transform', trBar);

    node.select('.group div.pagetext')
        .transition().duration(options.duration)
        .text(function(d){ return d.chapter.get('title'); })
    ;

    node.select('.group-highlight')
        .attr('height', function (d) { var h = d.height + 20; return h > 0 ? h : 0; })
        .attr('transform', trArea);
  };


  function trBar(d) { return "translate(" + (d.x - options.page.width / 2 - 5) + "," + (d.y - options.page.height / 2 - 20) + ")"; }
  function trArea(d) { return "translate(" + (d.x - options.page.width / 2 - 5) + "," + (d.y - options.page.height / 2 - 10) + ")"; }

});
