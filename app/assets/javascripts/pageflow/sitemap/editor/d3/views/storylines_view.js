sitemap.storylinesView = sitemap.groupView.define('storyline', function(s) {
  var width = s.settings.page.width + 35;
  var options = this.options;

  this.update()
    .classed('selected', s.utils.fn.d('selected'))
    .classed('highlighted', s.utils.fn.d('highlighted'))
    .classed('main', s.utils.fn.d('main'))
    .attr('transform', function(d) {
      return s.utils.translate(
        d.x - s.settings.page.width / 2 - 17,
        d.y - s.settings.page.height / 2 - 50
      );
    })
  ;

  this.child('rect.border', function() {
    this.enter()
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', width)
    ;

    this.update()
      .attr('height', function (d) {
        return d.height + 25;
      })
    ;
  });

  this.child('path.handle', function() {
    var height = 20;

    this.enter()
      .attr('d', rectRounedAtTop)
      .attr('width', width)
      .attr('height', height)
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
      .on('dblclick', s.utils.fn.trigger(this.options.dblclick))
      .on('mousedown', function() {
        if (options.mousedown) {
          options.mousedown.apply(this, arguments);
        }
      })
    ;

    function rectRounedAtTop() {
      var radius = 5;

      return 'M' + radius + ',' + 0 +
        'h' + (width - 2 * radius) +
        'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius +
        'v' + (height - radius) +
        'h' + (-width) +
        'v' + (radius - height) +
        'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius +
        'z';
    }
  });


  this.child('text', function() {
    this.enter()
      .attr('transform', s.utils.translate(7, 15))
    ;

    this.update()
      .text(s.utils.fn.d('title'))
    ;
  });

  this.enter().call(sitemap.behavior.multiDrag({
    drag: options.drag,
    dragend: options.dragend
  }));
});
