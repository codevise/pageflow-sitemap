pageflow.sitemap.layout.Collision = function(draggedLayout, targetLayout) {
  this.pagesGroupedByDragTargetChapters = function() {
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

    if (!found) {
      result.push({
        chapter: null,
        pages: draggedLayout.draggedPages
      });
    }

    return result;
  };
};
