/*globals pageflow, graphEditor */

graphEditor.graphFactory = function (chapters) {
  var graph = Graph.create();

  var lastLaneIndex = 0;
  _(chapters.groupBy(function(c) { return c.configuration.get('lane') || 0; })).forEach(function(chapters, laneIndex) {

    // ensure empty lanes
    for(;lastLaneIndex < laneIndex-1; lastLaneIndex++) {
      graph.lane().end();
    }
    lastLaneIndex = laneIndex;

    var lane = graph.lane();

    _(chapters).sortBy(function(c) {
      return c.configuration.get('row');
    }).forEach(function(chapter) {
      var group = lane.group(chapter);
      chapter.sitemapGroup = group; // FIXME:  this need to be done in graph.js similar to sitemapPage

      var row = chapter.configuration.get('row');
      if (_.isNumber(row)) {
        group.row(row);
      }
      chapter.pages.forEach(function(page) {
        group.page(page).end();
      });
      group.end();
    });
    lane.end();
  });

  return graph.end();
};
