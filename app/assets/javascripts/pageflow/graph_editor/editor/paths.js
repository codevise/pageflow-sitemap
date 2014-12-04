/*global graphEditor, d3, options*/
graphEditor.diagonal = d3.svg.diagonal()
  .source(function(d) {
    var x = d.source.x, deltaX = d.source.x - d.target.x,
      y = d.source.y, deltaY = d.source.y - d.target.y,
      offset;

    if (Math.abs(deltaX) < Math.abs(deltaY)) {
      offset = options.page.height / 2;
      y += deltaY > 0 ? -offset : offset;
    } else {
      offset = options.page.width / 2;
      x += deltaX > 0 ? -offset : offset;
    }

    return {
      "x": x,
      "y": y
    };
  })
  .target(function(d) {
    var x = d.target.x, deltaX = d.source.x - d.target.x,
      y = d.target.y, deltaY = d.source.y - d.target.y,
      offset;

    if (Math.abs(deltaX) < Math.abs(deltaY)) {
      offset = options.page.height / 2 + options.arrowSize;
      y += deltaY > 0 ? offset : -offset;
    } else {
      offset = options.page.width / 2 + options.arrowSize;
      x += deltaX > 0 ? offset : -offset;
    }

    return {
      "x": x,
      "y": y
    };
  });

graphEditor.short = d3.svg.diagonal()
  .source(function(d) { return {"x":d.source.x, "y":d.source.y}; })
  .target(function(d) { return {"x":d.source.x, "y":d.source.y}; });
