/*global sitemap, d3, _*/

sitemap.addDrag = function(id) {
    var dragging = false,
        dx, dy;

  var dragStart = function () {},
      dragEnd = function () {},
      dummySelector,
      dropTargets = [];

  var drag = d3.behavior.drag()
      .on("dragstart", function dragStartHandler() {
        d3.event.sourceEvent.preventDefault();

        var offset = drag.offsetFn.apply(this, arguments);
        dx = offset.x;
        dy = offset.y;
      })

      .on("drag", function dragHandler() {
        var dummy = dummySelector.apply(this, arguments);

        if (!dragging) { // init drag
          dragStart.apply(this, arguments);
          dummy.classed('active', true);

          // enable drop zones
          dropTargets.forEach(function (target) {
            var selection = d3.selectAll(target.selector)
                .on('mouseover.drop-' + id, function (d) {
                  target.current = d;
                })
                .on('mouseout.dropGroup', function () {
                  target.current = null;
                });

            target.dragStart.call(selection, arguments);
          });
        }

        dx += d3.event.dx;
        dy += d3.event.dy;

        dummy.attr("transform", "translate(" + dx + "," + dy + ")");

        dragging = true;
      })

      .on("dragend", function dragEndHandler(source) {
        if (!dragging) return;

        dragging = false;

        dummySelector.apply(this, arguments).classed('active', false);

        dropTargets.forEach(function dropTagetsIterator(target) {
          target.dragEnd.call(d3.selectAll(target.selector), arguments);
          if (target.current) {
            target.onDropped.call(this, source, target.current);
          }
        });

        dragEnd.apply(this, arguments);
      });

  drag.dummy = function(selector) {
    dummySelector = selector;
    return this;
  };

  drag.offsetFn = function () { return { x: 0, y: 0 }; };
  drag.offset = function (fn) {
    drag.offsetFn = fn;
    return this;
  };

  drag.start = function (fn) {
    dragStart = fn;
    return this;
  };

  drag.end = function (fn) {
    dragEnd = fn;
    return this;
  };

  drag.dropTarget = function (id) {
    var target = {
      selector: '.' + id,
      dragStart: function () {},
      start: function (fn) {
        this.dragStart = fn;
        return this;
      },
      dragEnd: function () {},
      end: function (fn) {
        this.dragEnd = fn;
        return this;
      },
      dropped: function (fn) {
        this.onDropped = fn;
        return this;
      },
      dropTarget: _.bind(drag.dropTarget, drag),
      listener: _.bind(drag.listener, drag)
    };

    dropTargets.push(target);

    return target;
  };

  drag.listener = function () {
    return drag;
  };

  return drag;
};
