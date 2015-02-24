/*global options*/

sitemap.chaptersView = sitemap.groupView.define('chapter', function(s) {
  var opts = this.options;

  var w = 90,
      barHeight = 15;

  this.update()
    .classed('selected', s.utils.fn.d('selected'))
    .classed('dragged', s.utils.fn.d('dragged'))
    .attr('transform', function(d) {
      return 'translate(' +
        (d.x - options.page.width / 2 - 5) + ',' +
        (d.y - options.page.height / 2 - 20) +
        ')';
    })
  ;

  this.child('rect.border', function() {
    this.enter()
      .attr('width', w)
    ;

    this.update()
      .attr('height', function (d) { var h = d.height + 25; return h > 0 ? h : 0; })
    ;
  });

  this.child('rect.handle', function() {
    this.enter()
      .attr('width', w)
      .attr('height', barHeight)
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
  });

  this.enter().call(sitemap.behavior.multiDrag({
    drag: opts.drag,
    dragend: opts.dragend
  }));

  this.enter()
    .append('foreignObject')
        .style('pointer-events', 'none')
        .attr('width', w)
        .attr('height', barHeight)
        .append('xhtml:body')
        .html('<div class="title_text"></div>')
  ;

  this.update().each(function(d) {
    d3.selectAll(this.getElementsByTagName('div'))
      .text(d.chapter.get('title'));
  });
});
