pageflow.sitemap.layout.Grid = function(pagesGroupedByChapters, options) {
  var chapterPositions = {};
  var pagePositions = {};

  this.pagesGroupedByChapters = pagesGroupedByChapters;
  this.laneWidth = options.laneWidth;
  this.rowHeight = options.rowHeight;

  this.chapterPosition = function(chapter) {
    return chapterPositions[chapter.cid];
  };

  this.pagePosition = function(page) {
    return pagePositions[page.cid];
  };

  this.chapterCoordinates = function(chapter) {

  };

  this.isLegal = function() {

  };

  _.each(pagesGroupedByChapters, function(group) {
    var chapter = group.chapter;

    chapterPositions[chapter.cid] = {
      x: lane(chapter) * options.laneWidth,
      y: row(chapter) * options.rowHeight
    };

    _.each(group.pages, function(page, index) {
      pagePositions[page.cid] = {
        x: lane(chapter) * options.laneWidth,
        y: (row(chapter) + index) * options.rowHeight
      };
    });
  });

  function lane(chapter) {
    return chapter.configuration.get('lane') || 0;
  }

  function row(chapter) {
    return chapter.configuration.get('row') || 0;
  }
};