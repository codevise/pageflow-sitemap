/*global graphEditor, d3*/

graphEditor.ZoomHandler = function (group) {
  var listener = d3.behavior.zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", function () {
      var translate = "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")";
      group.attr("transform", translate);
  });

  this.listener = function () { return listener; };
};
