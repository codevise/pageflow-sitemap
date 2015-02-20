(function() {
  var s = pageflow.sitemap;

  s.GridLayout = function(pagesGroupedByChapters) {
    this.chapterPosition = function(chapter) {

    };

    this.pagePosition = function(page) {

    };
  };

  s.DraggingLayout = function(layout, selection, delta) {
    this.chapterPosition = function(chapter) {

    };

    this.pagePosition = function(page) {

    };

    this.isDragged = function(chapter) {

    };

    this.isLegal = function() {

    };
  };

  s.PageCollision = function(layout, pagesGroupedByChapters, draggedPages) {
    this.pagesGroupedByDragTargetChapters = function() {
      var result = {};

      _(pagesGroupedByChapters).each(function(pages, chapter) {
        var virtualPages = result[chapter.id] = [];

        _(pages).each(function(page) {
          if (_(draggedPages).contains(page)) {
            _(draggedPages).each(function(draggedPage) {
              if (draggedBeforePage(draggedPage, page)) {
                virtualPages.push(draggedPage);
              }
            });

            virtualPages.push(page);
          }
        });

        _(selection.get('pages')).each(function(selectedPage) {
        var selectedPageData = nodesByName[selectedPage.cid];

        if (draggedBelowChapter(selectedPageData, chapterData)) {
          chapterData.virtualPages.push(selectedPage);
        }
      });
    });

    function draggedBeforePage(draggedPage, page) {
      var pagePos = layout.pagePosition(draggedPage);
      var draggedPos = layout.pagePosition(draggedPage);

      return (Math.abs(draggedPos.x - pagePos.x) < layout.laneWidth / 2 &&
              Math.abs(draggedPos.y - pagePos.y) < layout.rowHeight / 2 &&
              draggedPos.y <= pagePos.y + layout.rowHeight / 2);
    }

    function draggedBelowChapter(draggedPage, chapter) {
      var chapterBottom = chapter.y + chapter.virtualPages.length * rowHeight;

      return (Math.abs(draggedPage.x - chapter.x) < laneWidth / 2 &&
              Math.abs(draggedPage.y - chapterBottom) < rowHeight / 2 &&
              draggedPage.y < chapterBottom + rowHeight / 2);
    }
    };
  };
}());

pageflow.sitemap.layout = function(chapters, pages, selection, options, chapterMapping) {
    var laneWidth = this.laneWidth = 2 * sitemap.settings.page.horizontalMargin + sitemap.settings.page.width,
      rowHeight = this.rowHeight = 2 * sitemap.settings.page.verticalMargin + sitemap.settings.page.height;

    chapters.each(function(chapter) {
      var chapterLane = chapter.configuration.get('lane') || 0;
      var chapterRow = chapter.configuration.get('row') || 0;

      var x = chapterLane * laneWidth;

      var chapterNodes = [];

      var groupSelected = selection.contains(chapter);

      var chapterDx = groupSelected ? options.dragDx : 0;
      var chapterDy = groupSelected ? options.dragDy : 0;

      var rowIndex = chapterRow;

      chapter.pages.each(function(page, index) {
        var id = "page:" + page.cid;

        var pageDx = selection.contains(page) ? options.dragDx : chapterDx;
        var pageDy = selection.contains(page) ? options.dragDy : chapterDy;

        var knobs = [];

        if (page.pageLinks() && !options.hideKnobs) {
          knobs.push({
            pid: id,
            id: 'default',
            text: 'default',
            exceeded: !page.pageLinks().canAddLink()
          });
        }

        var node = {
          id: id,
          page: page,
          chapter: chapter,
          selected: selection.contains(page),
          dragged: selection.contains(page) && ('dragDx' in options),
          x0: typeof page.x0 == "undefined" ? x : page.x0,
          y0: typeof page.y0 == "undefined" ? (rowIndex - 1) * rowHeight : page.y0,
          x: x + pageDx,
          y: rowIndex * rowHeight + pageDy,
          availKnobs: knobs,
          visibleKnobs: []
        };

        if (!node.dragged) {
          rowIndex += 1;
        }

        chapterNodes.push(node);
        nodes.push(node);

        nodesByName[page.cid] = node;
      });

      buildSuccesor(chapter);

      chapters.push({
        id: 'group:' + chapter.cid,
        chapter: chapter,
        nodes: chapterNodes,
        selected: groupSelected,
        dragged: groupSelected && ('dragDx' in options),
        x: x + chapterDx,
        y: chapterRow * rowHeight + chapterDy,
        height: chapter.pages.length * rowHeight - 2 * sitemap.settings.page.verticalMargin
      });
    });
};