pageflow.sitemap.selectableLinksView = function(className, path) {
  return pageflow.sitemap.groupView.define(className, function(s) {
    this.enter()
      .classed('selectable_link', true)
    ;

    this.update()
      .sort(function(d1, d2) {
        return d1.selected ? 1 : -1;
      })
      .classed('selected', s.utils.fn.d('selected'))
      .classed('dragged', s.utils.fn.d('dragged'))
      .classed('placeholder', s.utils.fn.d('placeholder'))
    ;

    this.child('path.selection_highlight', function() {
      this.update()
        .attr('d', path)
      ;
    });

    this.child('path.arrow', function() {
      this.update()
        .attr('d', path)
      ;
    });

    this.child('path.selection_target', function() {
      this.enter()
        .on('mousedown', this.options.click)
        .on('mouseover', function() {
          d3.select(this.parentNode).classed('highlight', true);
        })
        .on('mouseout', function() {
          d3.select(this.parentNode).classed('highlight', false);
        })
      ;

      this.update()
        .attr('d', path);
    });

    this.child('circle.drag_target', function() {
      this.enter()
        .attr('r', function(d) { return d.placeholder ? 20 : 10; })
        .on('mousedown', this.options.click)
        .call(sitemap.behavior.multiDrag({
          drag: this.options.drag,
          dragend: this.options.dragend,
        }));

      this.update()
        .attr('cx', function(d) {
          return path.points(d).end.x;
        })
        .attr('cy', function(d) { return path.points(d).end.y; })
      ;
    });
  });
};