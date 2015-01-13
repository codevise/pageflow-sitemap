/*global sitemap, d3, options, pageflow*/
sitemap.PanHandler = function(svgElement, svgGroup) {
  var svg = d3.select(svgElement);
  var zoomHandler = sitemap.ZoomHandler.create(svgGroup);
  var zoomListener = zoomHandler.listener();
  svg.call(zoomListener);

  var w, h;

  this.resize = function() {
    w = parseInt(svg.style('width'), 10);
    h = parseInt(svg.style('height'), 10);
  };

  this.update = function() {
    var relCoords = d3.mouse(svg.node());

    // auto-panning when dragging a node close to the edge
    var panBoundary = options.panBoundary;
    if (relCoords[0] < panBoundary) {
      pan(this, 'left' , options.panSpeed);
    } else if (relCoords[0] > (w - panBoundary)) {
      pan(this, 'right', options.panSpeed);
    } else if (relCoords[1] < panBoundary) {
      pan(this, 'up', options.panSpeed);
    } else if (relCoords[1] > (h - panBoundary)) {
      pan(this, 'down', options.panSpeed);
    }
  };

  // paning when dragging a node close to the edge
  function pan(domNode, direction, speed) {
    var translateX, translateY, scaleX, scaleY, scale;
    var translateCoords = d3.transform(svgGroup.attr("transform"));
    if (direction == 'left' || direction == 'right') {
      translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
      translateY = translateCoords.translate[1];
    } else if (direction == 'up' || direction == 'down') {
      translateX = translateCoords.translate[0];
      translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
    }
    scaleX = translateCoords.scale[0];
    scaleY = translateCoords.scale[1];
    scale = zoomListener.scale();
    svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
    d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
    zoomListener.scale(zoomListener.scale());
    zoomListener.translate([translateX, translateY]);
  }
};
