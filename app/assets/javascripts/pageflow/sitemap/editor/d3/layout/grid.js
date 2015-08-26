pageflow.sitemap.layout.Grid = function(chaptersGroupedByStorylines, pagesGroupedByChapters, options) {
  var positions = {};
  var storylineHeights = {};
  var chapterSizes = {};
  var heights = {};
  var size = {x: 0, y: 0};

  var laneWidth = this.laneWidth = options.pageWidth + 2 * options.pageMarginWidth;
  var rowHeight = this.rowHeight = options.pageHeight + 2 * options.pageMarginHeight;

  this.chaptersGroupedByStorylines = chaptersGroupedByStorylines;
  this.pagesGroupedByChapters = pagesGroupedByChapters;
  this.size = size;

  this.position = function(target) {
    return positions[target.cid];
  };

  this.linkSource = function(page) {
    return {
      x: this.position(page).x,
      y: this.position(page).y,
      width: options.pageWidth,
      height: options.pageHeight
    };
  };

  this.linkTarget = function(page, link) {
    return this.linkSource(page);
  };

  this.chapterHeight = function(chapter) {
    return heights[chapter.cid];
  };

  this.height = function(target) {
    if (!heights[target.cid]) {
      debugger;
    }

    return heights[target.cid];
  };

  this.isAbovePage = function(page, position) {
    var pagePosition = this.position(page);

    return (Math.abs(position.x - pagePosition.x) < laneWidth / 2 &&
            Math.abs(position.y - pagePosition.y) <= rowHeight / 2 &&
            position.y < pagePosition.y + rowHeight / 2);
  };

  this.isAboveChapter = function(chapter, position) {
    var chapterPosition = this.position(chapter);

    return (Math.abs(position.x - chapterPosition.x) < laneWidth / 2 &&
            Math.abs(position.y - chapterPosition.y) <= rowHeight / 2 &&
            position.y < chapterPosition.y + rowHeight / 2);
  };

  this.pointInsidePage = function(page, position) {
    var pagePosition = this.position(page);

    return (Math.abs(position.x - pagePosition.x) <= (options.pageWidth + options.pageMarginWidth) / 2 &&
            Math.abs(position.y - pagePosition.y) <= (options.pageHeight + options.pageMarginHeight) / 2);
  };

  this.pointInsideChapter = function(chapter, position) {
    var chapterPosition = this.position(chapter);
    var chapterHeight = this.chapterHeight(chapter);

    return (Math.abs(position.x - chapterPosition.x) < laneWidth / 2 &&
            position.y >= chapterPosition.y - rowHeight / 2 &&
            position.y < chapterPosition.y + chapterHeight);
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

  this.isBelowStoryline = function(storyline, position) {
    var storylinePosition = this.position(storyline);
    var storylineBottom =
      this.position(storyline).y +
      this.height(storyline) +
      2 * options.pageMarginHeight;

    return (Math.abs(position.x - storylinePosition.x) < laneWidth / 2 &&
            Math.abs(position.y - storylineBottom) <= rowHeight / 2 &&
            position.y < storylineBottom + rowHeight / 2);
  };

  this.laneAndRowFromPoint = function(position) {
    return {
      lane: Math.round(position.x / laneWidth),
      row: Math.round(position.y / rowHeight)
    };
  };

  this.freeGridCellFromPoint = function(position) {
    if (!this.chapterFromPoint(position) &&
        !this.pageFromPoint(position)) {

      return this.gridCellFromPoint(position);
    }
  };

  this.gridCellFromPoint = function(position) {
    var laneAndRow = this.laneAndRowFromPoint(position);

    if (laneAndRow.lane >= 0 && laneAndRow.row >= 0) {
      return {
        laneAndRow: laneAndRow,
        x: laneAndRow.lane * laneWidth,
        y: laneAndRow.row * rowHeight,
        width: options.pageWidth,
        height: options.pageHeight
      };
    }
  };

  this.chapterFromPoint = function(position) {
    var that = this;

    return _(pagesGroupedByChapters).reduce(function(result, group) {
      return result || (group.chapter &&
                        that.pointInsideChapter(group.chapter, position));
    }, null);
  };

  this.pageFromPoint = function(position) {
    var that = this;

    return _(pagesGroupedByChapters).reduce(function(result, group) {
      return result || _(group.pages).find(function(page) {
        return that.pointInsidePage(page, position);
      });
    }, null);
  };

  this.isLegal = function() {
  };

  _.each(pagesGroupedByChapters, function(group) {
    var chapter = group.chapter;

    if (chapter) {
      var chapterSize = Math.max(1, group.pages.length);
      chapterSizes[chapter.cid] = chapterSize;
      heights[chapter.cid] = chapterSize * rowHeight - 2 * options.pageMarginHeight;
    }
  });

  _.each(chaptersGroupedByStorylines, function(group) {
    var storyline = group.storyline;

    if (storyline) {
      positions[storyline.cid] = {
        x: lane(storyline) * laneWidth,
        y: row(storyline) * rowHeight
      };

      var storylineSize = _.reduce(group.chapters, function(offset, chapter) {
        var chapterSize = chapterSizes[chapter.cid];

      var storylineLane = lane(storyline);
        var storylineRow = row(storyline) + offset;

        positions[chapter.cid] = {
          _lane: storylineLane,
          _row: storylineRow,
          x: storylineLane * laneWidth,
          y: storylineRow * rowHeight
        };

        return offset + chapterSize;
      }, 0);

      heights[storyline.cid] = Math.max(1, storylineSize) * rowHeight;

      if (!heights[storyline.cid]) {
        debugger;
      }
    }
  });

  _.each(pagesGroupedByChapters, function(group) {
    var chapter = group.chapter;

    if (chapter && positions[chapter.cid]) {
      var chapterLane = positions[chapter.cid]._lane;
      var chapterRow = positions[chapter.cid]._row;

      _.each(group.pages, function(page, index) {
        positions[page.cid] = {
          x: chapterLane * laneWidth,
          y: (chapterRow + index) * rowHeight
        };

        size.x = Math.max(size.x, positions[page.cid].x + laneWidth);
        size.y = Math.max(size.y, positions[page.cid].y + rowHeight);
      });
    }
  });

  function lane(storyline) {
    return storyline.configuration.get('lane') || 0;
  }

  function row(storyline) {
    return storyline.configuration.get('row') || 0;
  }
};