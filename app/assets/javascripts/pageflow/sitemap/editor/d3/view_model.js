sitemap.ViewModel = function(entry, selection, layout, options) {
  var chapters = this.chapters = [];
  var nodes = this.nodes = this.pages = [];
  var followLinks = this.followLinks = [];
  var successorLinks = this.successorLinks = [];
  var pageLinks = this.links = [];
  var size = this.size = {x: 0, y: 0};

  var nodesByName = {};

  var laneWidth = this.laneWidth = 2 * sitemap.settings.page.horizontalMargin + sitemap.settings.page.width,
      rowHeight = this.rowHeight = 2 * sitemap.settings.page.verticalMargin + sitemap.settings.page.height;

  buildChaptersAndPages();
  buildFollowLinks();
  buildSuccessorLinks();
  buildPageLinks();

  setSize();

  function buildChaptersAndPages() {
    entry.chapters.each(function(chapter) {
      var chapterNodes = [];

      chapter.pages.each(function(page) {
        var id = "page:" + page.cid;

        var node = {
          id: id,

          page: page,
          chapter: chapter,

          selected: selection.contains(page),
          dragged: layout.isDragging(page),
          x0: layout.position(page).x,
          y0: layout.position(page).y,
          x: layout.position(page).x,
          y: layout.position(page).y,

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
        dragged: layout.isDragging(chapter),
        droppable: layout.isLegal(),

        x: layout.position(chapter).x,
        y: layout.position(chapter).y,
        height: layout.chapterHeight(chapter)
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
    _(layout.pagesGroupedByChapters).each(function(group) {
      eachPair(group.pages, function(first, second) {
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
      target: nodesByName[targetPage.cid]
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
