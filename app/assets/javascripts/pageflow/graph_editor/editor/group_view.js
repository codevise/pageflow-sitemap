/*global graphEditor, options, d3*/

graphEditor.groupView = graphEditor.D3View(function(svg) {
  svg.enter = function (nodeEnter, opts) {
    var g = nodeEnter.append("svg:g")
        .attr('id', function (d) { return d.id; })
        .attr('class', 'group');

    var representationNode = g.append('svg:g');

    var w = 90,
        barHeight = 10;

    representationNode.append('svg:rect')
        .attr('class', 'group-handle')
        .attr('width', w)
        .attr('height', barHeight)
        .attr('transform', trBar)
        .call(drag(opts))
        .on('mouseover', function() {
          d3.select(this.parentNode).classed('hover', true);
        })
        .on('mouseout', function() {
          d3.select(this.parentNode).classed('hover', false);
        });

    representationNode.append('svg:rect')
        .attr('class', 'group-highlight')
        .attr('width', w)
        .attr('height', function (d) { return d.height + 20; })
        .attr('transform', trArea);

    representationNode.append('svg:rect')
        .attr('class', 'group-dummy')
        .attr('width', w)
        .attr('height', barHeight)
        .attr('transform', trBar);
  };

  svg.update = function(node) {
    node.select('.group-handle')
        .attr('transform', trBar);

    node.select('.group-highlight')
        .attr('height', function (d) { return d.height + 20; })
        .attr('transform', trArea);
  };

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
