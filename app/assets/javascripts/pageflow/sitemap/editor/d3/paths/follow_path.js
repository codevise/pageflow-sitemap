pageflow.sitemap.followPath = function(d) {
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

  var p = [start, p1, p2, end];
  p = p.map(function(d) { return [d.x, d.y]; });

  return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
};
