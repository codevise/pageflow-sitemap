sitemap.behavior = sitemap.behavior || {};

sitemap.behavior.scrollAndZoom = function(options) {
  options = options || {};

  var view = {x: options.x || 0, y: options.y || 0, k: 1};
  var dispatch = d3.dispatch('change');

  var minScale = options.minScale || 0.1;
  var maxScale = options.maxScale || 10;
  var margin = options.margin || 0;
  var minX = -100;
  var minY = -100;
  var maxX = 100;
  var maxY = 100;
  var size = {x: 0, y: 0};
  var initPos = false;

  function behavior(g) {
    g.call(sitemap.behavior.mouseWheel()
           .on('wheel', onWheel))
      .on('mousedown', onMouseDown);
  }

  behavior.updateConstraints = function(newMinX, newMinY, newMaxX, newMaxY) {
    minX = newMinX;
    minY = newMinY;
    maxX = newMaxX;
    maxY = newMaxY;

    if (!initPos) {
      view.x = Infinity;
      view.y = Infinity;
      initPos = true;
    }

    normalize();
    dispatchChange();
  };

  behavior.updateSize = function(x, y) {
    size.x = x;
    size.y = y;

    normalize();
    dispatchChange();
  };

  behavior.getScale = function() {
    return (view.k - minScale) / (maxScale - minScale) * 100;
  };

  behavior.setScale = function(percent) {
    var r = percent / 100;
    scaleTo(minScale * (1 - r) + maxScale * r);

    normalize();
    dispatchChange();
  };

  behavior.getScrollX = function() {
    var _maxX = maxX * view.k + margin;
    var _minX = Math.min(_maxX, minX * view.k + size.x - margin);

    return (view.x - _maxX) / (_minX - _maxX) * 100;
  };

  behavior.setScrollX = function(percent) {
    var _maxX = maxX * view.k + margin;
    var _minX = Math.min(_maxX, minX * view.k + size.x - margin);
    var r = percent / 100;

    view.x = _minX * r + _maxX * (1 - r);
    dispatchChange();
  };

  behavior.getScrollY = function() {
    var _maxY = maxY * view.k + margin;
    var _minY = Math.min(_maxY, minY * view.k + size.y - margin);

    return (view.y - _minY) / (_maxY - _minY) * 100;
  };

  behavior.setScrollY = function(percent) {
    var _maxY = maxY * view.k + margin;
    var _minY = Math.min(_maxY, minY * view.k + size.y - margin);
    var r = percent / 100;

    view.y = _minY * (1 - r) + _maxY * r;
    dispatchChange();
  };

  behavior.getScrollWindowProportionX = function() {
    var _maxX = maxX * view.k + margin;
    var _minX = Math.min(_maxX, minX * view.k - margin);

    return Math.min(1, size.x / (_maxX - _minX));
  };

  behavior.getScrollWindowProportionY = function() {
    var _maxY = maxY * view.k + margin;
    var _minY = Math.min(_maxY, minY * view.k - margin);

    return Math.min(1, size.y / (_maxY - _minY));
  };

  function dispatchChange() {
    dispatch.change({
      scale: view.k,
      translate: [view.x, view.y]
    });
  }

  function location(p) {
    return [(p[0] - view.x) / view.k, (p[1] - view.y) / view.k];
  }

  function point(l) {
    return [l[0] * view.k + view.x, l[1] * view.k + view.y];
  }

  function scaleTo(s) {
    view.k = restrict(s, minScale, maxScale);
  }

  function translateTo(p, l) {
    l = point(l);

    view.x += p[0] - l[0];
    view.y += p[1] - l[1];

    normalize();
  }

  function normalize() {
    var _maxX = maxX * view.k + margin;
    var _maxY = maxY * view.k + margin;
    var _minX = Math.min(_maxX, minX * view.k + size.x - margin);
    var _minY = Math.min(_maxY, minY * view.k + size.y - margin);

    view.x = restrict(view.x, _minX, _maxX);
    view.y = restrict(view.y, _minY, _maxY);
  }

  function ensureInsideMargin(p) {
    view.x -= Math.max(0, p[0] - size.x + margin);
    view.x -= Math.min(0, p[0] - margin);
    view.y -= Math.max(0, p[1] - size.y + margin);
    view.y -= Math.min(0, p[1] - margin);

    normalize();
    dispatchChange();
  }

  function restrict(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function onWheel(event) {
    var center0 = event.point;
    var translate0 = location(event.point);

    if (event.ctrlKey) {
      scaleTo(Math.pow(2, event.delta * 0.002) * view.k);
      translateTo(center0, translate0);
    }
    else if (event.shiftKey || event.altKey) {
      center0[0] += Math.sign(event.delta) * 50;
    }
    else {
      center0[1] += Math.sign(event.delta) * 50;
    }

    translateTo(center0, translate0);
    dispatchChange();
  }

  function onMouseDown() {
    if (event.which !== 1) {
      return;
    }

    var that = this,
        timeout,
        mousemove = 'mousemove.zoomAndScroll',
        mouseup = 'mouseup.zoomAndScroll',
        subject = d3.select(window).on(mousemove, moved).on(mouseup, ended);

    function moved() {
      var p = d3.mouse(that);

      function tick() {
        ensureInsideMargin(p);

        clearTimeout(timeout);
        timeout = setTimeout(tick, 20);
      }

      tick();
    }

    function ended() {
      clearTimeout(timeout);
      subject.on(mousemove, null).on(mouseup, null);
    }
  }

  return d3.rebind(behavior, dispatch, 'on');
};
