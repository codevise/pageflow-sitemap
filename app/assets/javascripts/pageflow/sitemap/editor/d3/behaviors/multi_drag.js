sitemap.behavior.multiDrag = function(options) {
  options = options || {};

  var dragstart = 'dragstart.multiDrag';
  var dragmove = 'drag.multiDrag';
  var dragend = 'dragend.multiDrag';

  function behavior(g) {
    var handles = options.handle ? g.selectAll(options.handle) : g;
    var dx, dy;

    var xxx;

    var drag = d3.behavior.drag()
      .on(dragstart, function() {
        dx = 0;
        dy = 0;

        xxx = window.options.duration;
        window.options.duration = 0;
      })
      .on(dragmove, function() {
        dx += d3.event.dx;
        dy += d3.event.dy;

//        options.targets().attr('transform', 'translate(' + dx + ',' + dy + ')');
        options.drag({dx: dx, dy: dy});
      })
      .on(dragend, function() {
        window.options.duration = xxx;
        options.dragend({dx: dx, dy: dy});
      });

    handles.call(drag);
  }

  return behavior;
};