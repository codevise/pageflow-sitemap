pageflow.sitemap.selectableLinksView = function(options, fn) {
  var className = options.className;
  var path = options.path;
  var direction = options.direction;

  return pageflow.sitemap.groupView.define(className, function(s) {
    this.enter()
      .classed('selectable_link', true)
    ;

    this.update()
      .sort(function(d1, d2) {
        return d1.placeholder || d1.selected ? 1 : -1;
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
        .attr('marker-end', function(d) {
          return 'url(#' + className + (d.dragged ? '_triangle_highlight)' : '_triangle)');
        })
      ;
    });

    this.child('path.selection_target', function() {
      this.enter()
        .on('mousedown', this.options.click)
        .on('mouseover', function() {
          d3.select(this.parentNode)
            .classed('highlight', true)
            .select('.arrow').attr('marker-end', 'url(#' + className + '_triangle_highlight)')
          ;
        })
        .on('mouseout', function() {
          d3.select(this.parentNode)
            .classed('highlight', false)
            .select('.arrow').attr('marker-end', 'url(#' + className + '_triangle)')
          ;
        })
        .call(sitemap.behavior.multiDrag({
          drag: this.options.drag,
          dragend: this.options.dragend,
          enabled: function(d) {
            return d.selected;
          }
        }))
      ;

      this.update()
        .attr('d', path);
    });

    this.update().call(s.textLabelView(function(d) {
      var p = path.points(d);

      return [{
        id: d.id + ':label',
        label: d.label,
        x: p.end.x,
        y: p.end.y,
        anchor: p.end.x - p.start.x < 10 ? 'left' : 'right'
      }];
    }));

    this.child('path.drag_target', function() {
      this.enter()
        .call(s.behavior.tooltipTarget(options.placeholderTooltipTranslationKey))
        .on('mousedown', this.options.click)
        .call(sitemap.behavior.multiDrag({
          drag: this.options.drag,
          dragend: this.options.dragend,
        }));

      this.update()
        .attr('d', function(d) {
          var point = path.points(d).end;
          return direction === 'down' ? halfCircleBottom(point) : halfCircleRight(point);
        })
      ;

      function halfCircleBottom(point) {
        return 'M' + point.x + ',' + (point.y + 5) + ' h20 a20,20 0 0 1 -20,20 a20,20 0 0 1 -20,-20 z';
      }

      function halfCircleRight(point) {
        return 'M' + point.x + ',' + point.y + ' v-20 a20,20 0 0 1 20,20 a20,20 0 0 1 -20,20 z';
      }
    });

    if (fn) {
      fn.call(this, s);
    }
  });
};