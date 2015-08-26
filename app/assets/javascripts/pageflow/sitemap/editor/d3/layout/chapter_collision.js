pageflow.sitemap.layout.ChapterCollision = function(pagesGroupedByChapters) {
  this.pagesGroupedByChapters = function() {
    var laneHeights = {};

    return _(pagesGroupedByChapters).map(function(group) {
      var chapter = group.chapter;

      if (!chapter) {
        return group;
      }

      var lane = chapter.configuration.get('lane') || 0;
      var row = chapter.configuration.get('row') || 0;

      return {
        chapter: chapter,
        pages: group.pages,
        lane: lane,
        row: freeRow(lane, row, group.pages.length)
      };

      function freeRow(lane, row, pagesCount) {
        var laneHeight = laneHeights[lane] || 0;
        var result;

        result = Math.max(laneHeight, row);
        laneHeights[lane] = result + pagesCount + 1;

        return result;
      }
    }, []);
  };
};
