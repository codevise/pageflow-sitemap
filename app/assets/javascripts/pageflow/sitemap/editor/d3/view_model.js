pageflow.sitemap.ViewModel = function(session, layout) {
  var entry = session.entry;
  var selection = session.selection;
  var highlightedPage = session.highlightedPage;

  var storylines = this.storylines = [];
  var chapters = this.chapters = [];
  var nodes = this.nodes = this.pages = [];
  var successorLinks = this.successorLinks = [];
  var pageLinks = this.links = [];
  var chapterPlaceholders = this.chapterPlaceholders = [];
  var size = this.size = {x: 0, y: 0};

  var nodesByName = {};

  buildStorylines();
  buildSuccessorLinks();
  buildPageLinks();
  buildChapterPlaceholders();

  function buildStorylines() {
    entry.storylines.each(function(storyline) {
      storylines.push({
        id: 'storyline:' + storyline.cid,
        storyline: storyline,

        title: storyline.title(),

        main: storyline.isMain(),
        selected: selection.contains(storyline),
        dragged: layout.isDragging(storyline),
        droppable: layout.isLegal(),

        x: layout.position(storyline).x,
        y: layout.position(storyline).y,
        height: layout.height(storyline)
      });

      buildChapters(storyline.chapters);
    });
  }

  function buildChapters(chaptersCollection) {
    chaptersCollection.each(function(chapter) {
      var chapterNodes = [];

      chapter.pages.each(function(page) {
        var id = "page:" + page.cid;

        var thumbnailFile = page.thumbnailFile();

        var node = {
          id: id,

          page: page,
          chapter: chapter,

          pageCid: page.cid,
          title: page.title() || I18n.t('pageflow.sitemap.editor.unnamed_page'),
          thumbnailUrl: thumbnailFile ? thumbnailFile.get('link_thumbnail_url') : '',

          selected: selection.contains(page),
          dragged: layout.isDragging(page),
          highlighted: highlightedPage === page,
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

      chapters.push({
        id: 'group:' + chapter.cid,
        chapter: chapter,

        title: chapter.get('title') || I18n.t('pageflow.sitemap.editor.unnamed_chapter'),

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
    entry.storylines.each(function(storyline) {
      var successorPage = entry.pages.getByPermaId(storyline.configuration.get('scroll_successor_id'));
      var link = {successor: storyline};

      if (successorPage) {
        successorLinks.push({
          id: 'successor:' + storyline.cid + '-' + successorPage.cid,
          storyline: storyline,
          link: link,

          source: layout.linkSource(storyline),
          target: layout.linkTarget(successorPage, link),

          selected: selection.contains(link),
          dragged: layout.isDragging(link),
          placeholder: false
        });
      }
      else if (!storyline.isDestroying()) {
        successorLinks.push({
          id: 'dangling-successor:' + storyline.cid,
          storyline: storyline,
          link: link,

          source: layout.linkSource(storyline),
          target: layout.linkTarget(storyline, link),

          selected: selection.contains(link),
          dragged: layout.isDragging(link),
          placeholder: true
        });
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
