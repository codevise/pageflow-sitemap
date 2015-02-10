sitemap.behavior.selectionRect = function(options) {
  options = options || {};

  var mousedown = 'mousedown.selectionRect';
  var mousemove = 'mousemove.selectionRect';
  var mouseup = 'mouseup.selectionRect';

  var eventTarget = d3.select(window);

  function behavior(g) {
    var rect = g
      .append('svg:rect')
      .attr('class', 'selection')
      .style('visibility', 'hidden');

    g.on(mousedown, function() {
      if (d3.event.which !== 1) {
        return;
      }

      if (d3.event.target !== g.node()) {
        return;
      }

      var startPoint = d3.mouse(this);
      var container = g.select(options.container);
      var r0 = container.node().getBoundingClientRect();
      var timeout;

      g.on(mousemove, onMouseMove);
      eventTarget.on(mouseup, onMouseUp);

      function onMouseMove() {
        var point = d3.mouse(this);

        function tick() {
          var r1 = container.node().getBoundingClientRect();
          var translatedStartPoint = [
            startPoint[0] + r1.left - r0.left,
            startPoint[1] + r1.top - r0.top
          ];

          rect
            .attr('x', Math.min(point[0], translatedStartPoint[0]))
            .attr('y', Math.min(point[1], translatedStartPoint[1]))
            .attr('width', Math.abs(point[0] - translatedStartPoint[0]))
            .attr('height', Math.abs(point[1] - translatedStartPoint[1]))
            .style('visibility', 'visible');

          clearTimeout(timeout);
          timeout = setTimeout(tick, 20);
        }

        tick();
      }

      function onMouseUp() {
        clearTimeout(timeout);

        g.on(mousemove, null);
        eventTarget.on(mouseup, null);

        rect
          .style('visibility', 'hidden');

        dispatchSelectEvents();
      }

      function dispatchSelectEvents() {
        if (options.selected) {
          options.selected(selectedTargets().data());
        }
      }

      function selectedTargets() {
        return targets().filter(function() {
          return intersect(rect.node(), this);
        });
      }

      function targets() {
        return g.selectAll(options.targets);
      }
    });
  }

  function intersect(node1, node2) {
    var rect1 = node1.getBoundingClientRect();
    var rect2 = node2.getBoundingClientRect();

    return rect1.right > rect2.left &&
      rect1.left < rect2.right &&
      rect1.bottom > rect2.top &&
      rect1.top < rect2.bottom;
  }

  function dispatchEvent(node, eventName) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    node.dispatchEvent(event);
  }

  return behavior;
};