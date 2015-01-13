/*global s pageflow, sitemap, _, Graph*/

sitemap.graphFactory = function (chapters) {
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

      var row = chapter.configuration.get('row');
      if (_.isNumber(row)) {
        group.row(row);
      }
      chapter.pages.forEach(function(page) {
        var pageBuilder = group.page(page);

        var pageLinks = page.pageLinks();

        if (pageLinks) {
          pageBuilder.knob('default', pageLinks).end();
        }

        pageBuilder.end();
      });
      group.end();
    });
    lane.end();
  });

  return graph.end();
};
