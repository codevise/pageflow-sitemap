pageflow.sitemap.successorPath = function(d) {
  var points = sitemap.successorPath.points(d);

  var p = [points.start, points.p1, points.p2, points.end].map(function(d) {
    return [d.x, d.y];
  });

  return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
};

pageflow.sitemap.successorPath.points = function(d) {
  var deltaX = d.source.x - d.target.x;
  var deltaY = d.source.y - d.target.y;

  var start = { x: d.source.x, y: d.source.y},
      p1 = { x: d.source.x, y: d.source.y + 40},
      p2 = { x: d.target.x, y: d.target.y - 40},
      end = { x: d.target.x, y: d.target.y};

  var offsetStart = d.source.height / 2,
      offsetEnd = d.target.height / 2 + pageflow.sitemap.settings.arrowSize;

  start.y += offsetStart;
  p1.y += offsetStart;

  if (deltaX === 0 && deltaY === 0) {
    p1 = p2 = end = start;
  }
  else {
    end.y -= offsetEnd;
    p2.y -= offsetEnd;

    if (deltaX > 0) {
      end.x += 15;
      p2.x += 15;
    }
    else {
      end.x -= 15;
      p2.x -= 15;
    }
  }

  return {
    start: start,
    p1: p1,
    p2: p2,
    end: end
  };
};
