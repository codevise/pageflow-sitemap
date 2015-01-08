/*global graphEditor, d3, _, Backbone, $*/

graphEditor.ZoomHandler = function (group) {
  var listener = d3.behavior.zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", function () {
      var translate = "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")";
      group.attr("transform", translate);

      var zoom = d3.event.scale;
      d3.select('svg').classed('small', zoom >= 1.8 && zoom < 2.0);
      d3.select('svg').classed('xsmall', zoom >= 2.0);

  });

  this.listener = function () { return listener; };
};

graphEditor.ZoomHandler.create = function(group) {
  var zoomHandler = new graphEditor.ZoomHandler(group);
  return zoomHandler;
};
