sitemap.ViewModel = function(entry, selection, options) {
  options = _.extend({
    dragDx: 0,
    dragDy: 0
  }, options || {});

  var chapters = this.chapters = [];
  var nodes = this.nodes = this.pages = [];
  var followLinks = this.followLinks = [];
  var successorLinks = this.successorLinks = [];
  var pageLinks = this.links = [];
  var size = this.size = {x: 0, y: 0};

  this.placeholders = [];

  var nodesByName = {};

  var laneWidth = this.laneWidth = 2 * sitemap.settings.page.horizontalMargin + sitemap.settings.page.width,
      rowHeight = this.rowHeight = 2 * sitemap.settings.page.verticalMargin + sitemap.settings.page.height;

  buildChaptersAndPages();
  buildFollowLinks();
  buildSuccessorLinks();
  buildPageLinks();
  setSize();

  var s;

  function pagesGroupedByChapters() {
    entry.chapters.reduce(function(result, chapter) {
      result[chapter.cid] = chapter.pages;
      return result;
    }, {});
  }

  function buildChaptersAndPages() {
    var gridLayout = new s.GridLayout(pagesGroupedByChapters());
    var draggingLayout = this.chapterLayout = new s.DraggingLayout(gridLayout, selection, options.delta);

    var pageCollision = s.PageCollision(this.draggingLayout);
    var layout = new pageflow.sitemap.GridLayout(pageCollision.pagesGroupedByDragTargetChapters());

    entry.chapters.each(function(chapter) {
      var chapterNodes = [];

      chapter.pages.each(function(page) {
        var id = "page:" + page.cid;

        var node = {
          id: id,

          page: page,
          chapter: chapter,

          selected: selection.contains(page),
          dragged: draggingLayout.isDragged(page),
          position: layout.pagePosition(page),

          availKnobs: [],
          visibleKnobs: []
        };

        if (page.pageLinks() && !options.hideKnobs) {
          node.availKnobs.push({
            pid: id,
            id: 'default',
            text: 'default',
            exceeded: !page.pageLinks().canAddLink()
          });
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

        selected: selection.contains(chapter),
        dragged: draggingLayout.isDragged(chapter),
        droppable: draggingLayout.isLegal(),

        position: layout.chapterPosition(chapter),
        height: chapter.pages.length * rowHeight - 2 * sitemap.settings.page.verticalMargin
      });
    });
  }

  function buildVirtualPages() {
    _(chapters).each(function(chapterData) {
      chapterData.virtualPages = [];
      _(chapterData.nodes).each(function(pageData) {
        if (!pageData.dragged) {
          _(selection.get('pages')).each(function(selectedPage) {
            var selectedPageData = nodesByName[selectedPage.cid];

            if (draggedBeforePage(selectedPageData, pageData)) {
              chapterData.virtualPages.push(selectedPage);
            }
          });

          chapterData.virtualPages.push(pageData.page);
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
      return (Math.abs(draggedPage.x - page.x) < laneWidth / 2 &&
              Math.abs(draggedPage.y - page.y) < rowHeight / 2 &&
              draggedPage.y <= page.y + rowHeight / 2);
    }

    function draggedBelowChapter(draggedPage, chapter) {
      var chapterBottom = chapter.y + chapter.virtualPages.length * rowHeight;

      return (Math.abs(draggedPage.x - chapter.x) < laneWidth / 2 &&
              Math.abs(draggedPage.y - chapterBottom) < rowHeight / 2 &&
              draggedPage.y < chapterBottom + rowHeight / 2);
    }
  }

  function repositionVirtualPages() {
    _(chapters).each(function(chapterData) {
      var chapterRow = chapterData.chapter.configuration.get('row') || 0;

      _(chapterData.virtualPages).each(function(page, index) {
        var pageData = nodesByName[page.cid];

        if (!pageData.selected) {
          pageData.y = chapterData.y + index * rowHeight;
        }
      });
    });
  }

  function buildSuccesor(chapter) {
    var lastPage = chapter.pages.last();

    if (lastPage) {
      var successorPage = entry.pages.getByPermaId(lastPage.configuration.get('scroll_successor_id'));

      if (!successorPage) {
        nodesByName[lastPage.cid].successor = {
          id: 'group:successor:' + chapter.cid,
          pid: lastPage.cid,
          chapter: chapter
        };
      }
    }
  }

  function buildFollowLinks() {
    _(chapters).each(function(chapterData) {
      eachPair(chapterData.virtualPages, function(first, second) {
        followLinks.push(buildLink('follow', first, second));
      });
    });
  }

  function buildPageLinks() {
    entry.pages.each(function(page) {
      if (page.pageLinks()) {
        page.pageLinks().each(function(link) {
          if (link.targetPage()) {
            pageLinks.push(buildLink('link', page, link.targetPage(), {
              link: link,
              selected: selection.contains(link)
            }));
          }
        });
      }
    });
  }

  function buildSuccessorLinks() {
    entry.chapters.each(function(chapter) {
      var lastPage = chapter.pages.last();

      if (lastPage) {
        var successorPage = entry.pages.getByPermaId(lastPage.configuration.get('scroll_successor_id'));

        if (successorPage) {
          successorLinks.push(buildLink('successor', lastPage, successorPage));
        }
      }
    });
  }

  function buildLink(idPrefix, sourcePage, targetPage, options) {
    return _.extend({
      id: idPrefix + ':' + sourcePage.cid + '-' + targetPage.cid,
      source: nodesByName[sourcePage.cid],
      target: nodesByName[targetPage.cid],
    }, options || {});
  }

  function setSize() {
    _.forEach(nodes, function(node) {
      size.x = Math.max(node.x + laneWidth, size.x);
      size.y = Math.max(node.y + rowHeight, size.y);
    });

  }

  function eachPair(collection, fn) {
    if (collection.length < 2) {
      return;
    }

    _.reduce(collection, function(last, item) {
      fn(last, item);
      return item;
    });
  }
};
