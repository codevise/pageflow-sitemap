pageflow.sitemap.ViewModel = function(session, layout) {
  var entry = session.entry;
  var selection = session.selection;
  var highlightedPage = session.highlightedPage;

  var chapters = this.chapters = [];
  var nodes = this.nodes = this.pages = [];
  var followLinks = this.followLinks = [];
  var successorLinks = this.successorLinks = [];
  var pageLinks = this.links = [];
  var chapterPlaceholders = this.chapterPlaceholders = [];
  var size = this.size = {x: 0, y: 0};

  var nodesByName = {};
  var startPageFound = false;

  buildChaptersAndPages();
  buildFollowLinks();
  buildSuccessorLinks();
  buildPageLinks();
  buildChapterPlaceholders();

  function buildChaptersAndPages() {
    entry.chapters.each(function(chapter) {
      var chapterNodes = [];

      chapter.pages.each(function(page) {
        var id = "page:" + page.cid;
        var isStartPage = !!page.configuration.get('start_page');

        if (isStartPage) {
          startPageFound = true;
        }

        var node = {
          id: id,

          page: page,
          chapter: chapter,

          selected: selection.contains(page),
          dragged: layout.isDragging(page),
          highlighted: highlightedPage === page,
          startPage: isStartPage,
          destroying: page.isDestroying() || chapter.isDestroying(),

          x0: layout.position(page).x,
          y0: layout.position(page).y,
          x: layout.position(page).x,
          y: layout.position(page).y,
        };

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
        empty: chapterNodes.length === 0,
        destroying: chapter.isDestroying(),

        x: layout.position(chapter).x,
        y: layout.position(chapter).y,
        height: layout.chapterHeight(chapter)
      });
    });

    ensureStartPage();
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

  function ensureStartPage() {
    if (!startPageFound) {
      var page = entry.pages.first();

      if (page) {
        nodesByName[page.cid].startPage = true;
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
          var targetPage = link.targetPage();

          if (targetPage) {
            pageLinks.push({
              id: 'link' + ':' + page.cid + '-' + targetPage.cid,
              link: link,
              links: page.pageLinks(),
              sourcePage: page,

              source: layout.linkSource(page),
              target: layout.linkTarget(targetPage, link),

              label: link.label(),

              selected: selection.contains(link),
              dragged: layout.isDragging(link),
              placeholder: false
            });
          }
        });

        if (!page.isDestroying() && !page.chapter.isDestroying()) {
          var link = {placeholder: page};

          pageLinks.push({
            id: 'dangling-link' + ':' + page.cid,
            link: link,
            links: page.pageLinks(),
            sourcePage: page,

            source:  layout.linkSource(page),
            target: layout.linkTarget(page, link),

            selected: selection.contains(link),
            dragged: layout.isDragging(link),
            placeholder: true
          });
        }
      }
    });
  }

  function buildSuccessorLinks() {
    entry.chapters.each(function(chapter) {
      var lastPage = chapter.pages.last();

      if (lastPage) {
        var successorPage = entry.pages.getByPermaId(lastPage.configuration.get('scroll_successor_id'));
        var link = {successor: lastPage};

        if (successorPage) {
          successorLinks.push({
            id: 'successor:' + lastPage.cid + '-' + successorPage.cid,
            page: lastPage,
            link: link,

            source: layout.linkSource(lastPage),
            target: layout.linkTarget(successorPage, link),

            selected: selection.contains(link),
            dragged: layout.isDragging(link),
            placeholder: false
          });
        }
        else if (!lastPage.isDestroying() && !chapter.isDestroying()) {
          successorLinks.push({
            id: 'dangling-successor:' + lastPage.cid,
            page: lastPage,
            link: link,

            source: layout.linkSource(lastPage),
            target: layout.linkTarget(lastPage, link),

            selected: selection.contains(link),
            dragged: layout.isDragging(link),
            placeholder: true
          });
        }
      }
    });
  }

  function buildChapterPlaceholders() {
    if (layout.chapterPlaceholder) {
      chapterPlaceholders.push(_.extend({
        id: 'chapter-placeholder'
      }, layout.chapterPlaceholder));
    }
  }

  function buildLink(idPrefix, sourcePage, targetPage, options) {
    return _.extend({
      id: idPrefix + ':' + sourcePage.cid + '-' + targetPage.cid,
      source: nodesByName[sourcePage.cid],
      target: nodesByName[targetPage.cid],
    }, options || {});
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
