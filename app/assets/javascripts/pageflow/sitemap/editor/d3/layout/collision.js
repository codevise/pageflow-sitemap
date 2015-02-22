pageflow.sitemap.layout.Collision = function(draggedLayout, nonDraggedLayout) {
  this.pagesGroupedByDragTargetChapters = function() {
    var result = {};

    _(nonDraggedLayout.pagesGroupedByChapters).each(function(group) {
      var pages = [];

      result.push({
        chapter: group.chapter,
        pages: pages
      });

      _(group.pages).each(function(page) {
        _(draggedLayout.draggedPages).each(function(draggedPage) {
          if (draggedBeforePage(draggedPage, page)) {
            pages.push(draggedPage);
          }
        });

        pages.push(page);
      });

      _(draggedLayout.draggedPages).each(function(draggedPage) {
        if (draggedBelowChapter(draggedPage, group.chapter)) {
          pages.push(draggedPage);
        }
      });
    });
  };

  var laneWidth = nonDraggedLayout.laneWidth;
  var rowHeight = nonDraggedLayout.rowHeight;

  function draggedBeforePage(draggedPage, page) {
    var pagePos = nonDraggedLayout.pagePosition(page);
    var draggedPos = draggedLayout.pagePosition(draggedPage);

    return (Math.abs(draggedPos.x - pagePos.x) < laneWidth / 2 &&
            Math.abs(draggedPos.y - pagePos.y) < rowHeight / 2 &&
            draggedPos.y <= pagePos.y + rowHeight / 2);
  }

  function draggedBelowChapter(draggedPage, chapter) {
    var chapterBottom =
      nonDraggedLayout.chapterPos(chapter).y +
      nonDraggedLayout.chapterHeight(chapter);

    return (Math.abs(draggedPage.x - chapter.x) < laneWidth / 2 &&
            Math.abs(draggedPage.y - chapterBottom) < rowHeight / 2 &&
            draggedPage.y < chapterBottom + rowHeight / 2);
  }
};
