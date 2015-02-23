pageflow.sitemap.layout.Grid = function(pagesGroupedByChapters, options) {
  var positions = {};
  var chapterHeights = {};
  var size = {x: 0, y: 0};

  var laneWidth = this.laneWidth = options.pageWidth + 2 * options.pageMarginWidth;
  var rowHeight = this.rowHeight = options.pageHeight + 2 * options.pageMarginHeight;

  this.pagesGroupedByChapters = pagesGroupedByChapters;
  this.size = size;

  this.position = function(target) {
    return positions[target.cid];
  };

  this.chapterHeight = function(chapter) {
    return chapterHeights[chapter.cid];
  };

  this.isAbovePage = function(page, position) {
    var pagePosition = this.position(page);

    return (Math.abs(position.x - pagePosition.x) < laneWidth / 2 &&
            Math.abs(position.y - pagePosition.y) <= rowHeight / 2 &&
            position.y < pagePosition.y + rowHeight / 2);
  };

  this.isBelowChapter = function(chapter, position) {
    var chapterPosition = this.position(chapter);
    var chapterBottom =
      this.position(chapter).y +
      this.chapterHeight(chapter) +
      2 * options.pageMarginHeight;

    return (Math.abs(position.x - chapterPosition.x) < laneWidth / 2 &&
            Math.abs(position.y - chapterBottom) <= rowHeight / 2 &&
            position.y < chapterBottom + rowHeight / 2);
  };

  this.laneAndRowFromPoint = function(position) {
    return {
      lane: Math.round(position.x / laneWidth),
      row: Math.round(position.y / rowHeight),
    };
  };

  this.isLegal = function() {
  };

  _.each(pagesGroupedByChapters, function(group) {
    var chapter = group.chapter;

    if (chapter) {
      positions[chapter.cid] = {
        x: lane(chapter) * laneWidth,
        y: row(chapter) * rowHeight
      };

      chapterHeights[chapter.cid] = group.pages.length * rowHeight - 2 * options.pageMarginHeight;

      _.each(group.pages, function(page, index) {
        positions[page.cid] = {
          x: lane(chapter) * laneWidth,
          y: (row(chapter) + index) * rowHeight
        };

        size.x = Math.max(size.x, positions[page.cid].x + laneWidth);
        size.y = Math.max(size.y, positions[page.cid].y + rowHeight);
      });
    }
  });

  function lane(chapter) {
    return chapter.configuration.get('lane') || 0;
  }

  function row(chapter) {
    return chapter.configuration.get('row') || 0;
  }
};