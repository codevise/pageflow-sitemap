/*global options, sitemap*/

// path generator to be used in d3 attrib function for path element
// path.attr('d', sitemap.linkpath);
sitemap.linkpath = function(d) {
  var points = sitemap.linkpath.points(d);

  var p = [points.start, points.p1, points.p2, points.end].map(function(d) {
    return [d.x, d.y];
  });

  return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
};

sitemap.linkpath.points = function(d) {
  var deltaX = d.source.x - d.target.x;
  var deltaY = d.source.y - d.target.y;

  var start = { x: d.source.x, y: d.source.y + 5},
      p1 = { x: d.source.x, y: d.source.y + 5},
      p2 = { x: d.target.x, y: d.target.y - 5},
      end = { x: d.target.x, y: d.target.y - 5};

  var horizontalMargin = options.page.horizontalMargin * 2;

  var offsetStart = d.source.width / 2,
      offsetEnd = d.target.width / 2 + options.arrowSize;

  // start of path
  if (deltaX > options.page.width) {
    // path from left to right
    start.x -= offsetStart;
    p1.x -= offsetStart + horizontalMargin;

  }
  else {
    // path from right to left
    start.x += offsetStart;
    p1.x += offsetStart + horizontalMargin;
  }

  if (deltaX === 0 && deltaY === 0) {
    p1 = p2 = end = start;
  }
  else {
    if (deltaX < -options.page.width) {
      // path from right to left
      end.x -= offsetEnd;
      p2.x -= offsetEnd + horizontalMargin;
    }
    else {
      // path from left to right
      p2.x += offsetEnd + horizontalMargin;
      end.x += offsetEnd;
    }
  }

  return {
    start: start,
    p1: p1,
    p2: p2,
    end: end
  };
};
