pageflow.sitemap.layout.Collision = function(draggedLayout, targetLayout) {
  this.pagesGroupedByDragTargetChapters = function() {
    return this._pagesGroupedByDragTargetChapters;
  };

  this.chaptersGroupedByDragTargetStorylines = function() {
    return this._chaptersGroupedByDragTargetStorylines;
  };

  var fff = false;

  this._chaptersGroupedByDragTargetStorylines = (function() {
    var found = false;
    var result = [];

    _(targetLayout.chaptersGroupedByStorylines).each(function(group) {
      var chapters = [];

      result.push({
        storyline: group.storyline,
        chapters: chapters
      });

      _(group.chapters).each(function(chapter) {
        if (draggedLayout.draggedChapters.length) {
          if (targetLayout.isAboveChapter(chapter, draggedLayout.position(draggedLayout.draggedChapters[0]))) {
            pushAll(draggedLayout.draggedChapters);
          }
        }

        chapters.push(chapter);
      });

      if (draggedLayout.draggedChapters.length) {
        if (targetLayout.isBelowStoryline(group.storyline, draggedLayout.position(draggedLayout.draggedChapters[0]))) {
          pushAll(draggedLayout.draggedChapters);
        }
      }

      function pushAll(addedChapters) {
        found = true;

        _.each(addedChapters, function(chapter) {
          chapters.push(chapter);
        });
      }
    }, []);

    if (!found) {
      result.push({
        storyline: null,
        chapters: draggedLayout.draggedChapters
      });

      fff = true;
    }

    return result;
  }());


  this._pagesGroupedByDragTargetChapters = (function() {
    var found = false;
    var result = [];

    _(targetLayout.pagesGroupedByChapters).each(function(group) {
      var pages = [];

      result.push({
        chapter: group.chapter,
        pages: pages
      });

      _(group.pages).each(function(page) {
        if (draggedLayout.draggedPages.length) {
          if (targetLayout.isAbovePage(page, draggedLayout.position(draggedLayout.draggedPages[0]))) {
            pushAll(draggedLayout.draggedPages);
          }
        }

        pages.push(page);
      });

      if (draggedLayout.draggedPages.length) {
        if (targetLayout.isBelowChapter(group.chapter, draggedLayout.position(draggedLayout.draggedPages[0]))) {
          pushAll(draggedLayout.draggedPages);
        }
      }

      function pushAll(addedPages) {
        found = true;

        _.each(addedPages, function(page) {
          pages.push(page);
        });
      }
    }, []);

    if (draggedLayout.draggedChapters.length) {
      _.each(draggedLayout.draggedChapters, function(chapter) {
        result.push({
          chapter: chapter,
          pages: chapter.pages.toArray()
        });
      });
    }
    else if (!found) {
      result.push({
        chapter: null,
        pages: draggedLayout.draggedPages
      });
    }

    return result;
  }());
};
