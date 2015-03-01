pageflow.sitemap.followPath = function(d) {
  var points = sitemap.followPath.points(d);

  var p = [points.start, points.p1, points.p2, points.end].map(function(d) {
    return [d.x, d.y];
  });

  return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
};

pageflow.sitemap.followPath.points = function(d) {
  var start, p1, p2, end;
  var options = pageflow.sitemap.settings;

  start = {
    x: d.source.x,
    y: d.source.y + options.page.width / 2
  };
  p1 = start;

  p2 = {
    x: d.target.x,
    y: d.target.y - options.page.width / 2 - options.arrowSize - 20
  };
  end = {
    x: d.target.x,
    y: d.target.y - options.page.width / 2 - options.arrowSize
  };

  return {
    start: start,
    p1: p1,
    p2: p2,
    end: end
  };
};
