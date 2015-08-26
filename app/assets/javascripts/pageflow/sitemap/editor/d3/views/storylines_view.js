sitemap.storylinesView = sitemap.groupView.define('line', function(s) {
  var width = 100;
  var options = this.options;

  this.update()
    .classed('selected', s.utils.fn.d('selected'))
    .attr('transform', function(d) {
      return s.utils.translate(
        d.x - s.settings.page.width / 2 - 10,
        d.y - s.settings.page.height / 2 - 30
      );
    })
  ;

  this.child('rect.border', function() {
    this.enter()
      .attr('width', width)
    ;

    this.update()
      .attr('height', function (d) {
        return d.height - 10;
      })
    ;
  });

  this.child('rect.handle', function() {
    this.enter()
      .attr('width', width)
      .attr('height', 20)
      .attr('transform', s.utils.translate(0, -20))
      .on('mouseover', function() {
        d3.select(this.parentNode).classed('hover', true);
      })
      .on('mouseout', function() {
        d3.select(this.parentNode).classed('hover', false);
      })
      .on('click', function() {
        if (options.clicked) {
          options.clicked.apply(this, arguments);
        }
      })
      .on('mousedown', function() {
        if (options.mousedown) {
          options.mousedown.apply(this, arguments);
        }
      })
    ;
  });

  this.enter().call(sitemap.behavior.multiDrag({
    drag: options.drag,
    dragend: options.dragend
  }));
});
