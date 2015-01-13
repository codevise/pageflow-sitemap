/*global options, sitemap*/

// path generator to be used in d3 attrib function for path element
// path.attr('d', sitemap.linkpath);
sitemap.linkpath = function(d) {
  var deltaX = d.source.x - d.target.x;

  var start = { x: d.source.x, y: d.source.y},
      p1 = { x: d.source.x, y: d.source.y},
      p2 = { x: d.target.x, y: d.target.y},
      end = { x: d.target.x, y: d.target.y};

  var horizontalMargin = options.page.horizontalMargin * 2;

  var offsetStart = options.page.width / 2,
      offsetEnd = offsetStart + options.arrowSize;

  // start of path
  if (deltaX > 0) {
    // path from left to right
    start.x -= offsetStart;
    p1.x -= offsetStart + horizontalMargin;

  }
  else {
    // path from right to left
    start.x += offsetStart;
    p1.x += offsetStart + horizontalMargin;
  }

  // end of path
  if (deltaX >= 0) {
    // path from left to right
    p2.x += offsetEnd + horizontalMargin;
    end.x += offsetEnd;

  }
  else {
    // path from right to left
    end.x -= offsetEnd;
    p2.x -= offsetEnd + horizontalMargin;
  }

  var p = [start, p1, p2, end];
  p = p.map(function(d) { return [d.x, d.y]; });

  return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
};
