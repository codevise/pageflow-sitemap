/*global graphEditor, options, d3*/

graphEditor.groupView = graphEditor.D3View(function(svg) {
  svg.enter = function (nodeEnter, opts) {
    var g = nodeEnter.append("svg:g")
        .attr('id', function (d) { return d.id; })
        .attr('class', 'group');

    var representationNode = g.append('svg:g');

    var w = 90,
        barHeight = 10;

    var handleGroup = representationNode
        .append('svg:g')
        .attr('class', 'group-handle-group')
        .attr('transform', trBar)
        .call(drag(opts))
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
        .html(function(d){ return '<div class="pagetext">' + d.group.get('chapter').get('title') + '</div>'; })
        ;

    representationNode.append('svg:rect')
        .attr('class', 'group-highlight')
        .attr('width', w)
        .attr('height', function (d) { return d.height + 20; })
        .attr('transform', trArea)
        ;


    representationNode.append('svg:rect')
        .attr('class', 'group-dummy')
        .attr('width', w)
        .attr('height', barHeight)
        .attr('transform', trBar);
  };

  svg.update = function(node) {
    node.select('.group-handle-group')
        .transition().duration(options.duration)
        .attr('transform', trBar);

    node.select('.group div.pagetext')
        .transition().duration(options.duration)
        .text(function(d){ return d.group.get('chapter').get('title'); })
    ;

    node.select('text')
        .transition().duration(options.duration)
        .text(function(d){ return d.group.get('chapter').get('title'); })
        .attr('transform', trBarText);

    node.select('.group-highlight')
        .attr('height', function (d) { var h = d.height + 20; return h > 0 ? h : 0; })
        .attr('transform', trArea);
  };


  function trBarText(d) { return "translate(" + (d.x) + "," + (d.y - options.page.height / 2 - 15) + ")"; }
  function trBar(d) { return "translate(" + (d.x - options.page.width / 2 - 5) + "," + (d.y - options.page.height / 2 - 20) + ")"; }
  function trArea(d) { return "translate(" + (d.x - options.page.width / 2 - 5) + "," + (d.y - options.page.height / 2 - 10) + ")"; }

  function drag(opts) {
    return graphEditor.addDrag('page-drag')
      .dummy(function () { return d3.select(this.parentNode).select('.group-dummy'); })
      .offset(function (d) {
        return {
          x: d.x - options.page.width / 2 - 10,
          y: d.y - options.page.height / 2 - 20
        };
      })
      .dropTarget('area')
        .start(function () { this.style('pointer-events', 'all'); })
        .end(function () { this.style('pointer-events', 'none'); })
        .dropped(opts.droppedOnArea)
      .dropTarget('placeholder')
        .dropped(opts.droppedOnPlaceholder)
      .listener();
  }
});
