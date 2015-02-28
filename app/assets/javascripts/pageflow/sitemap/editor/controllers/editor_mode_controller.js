pageflow.sitemap.EditorModeController = pageflow.sitemap.AbstractController.extend({
  name: 'editor_mode',

  initialize: function() {
    this.selection = new pageflow.sitemap.Selection();

    new pageflow.sitemap.SelectionNavigator({
      selection: this.selection,
      multiSelectionPath: '/'
    }).attach();
  },

  chapterSelected: function (chapter, event) {
    if (!this.selection.contains(chapter)) {
      this.selection.select('chapters', [chapter], {
        additive: event.ctrlKey
      });
    }
  },

  chaptersSelected: function (chapters) {
    this.selection.select('chapters', chapters);
  },

  pageSelected: function (page, event) {
    this.selection.select('pages', [page], {
      additive: event.ctrlKey
    });
  },

  pageLinkSelected: function (pageLink) {
    this.selection.select('pageLinks', [pageLink]);
  },

  pageLinkDroppedOnPage: function(links, link, page) {
    links.updateLink(link, page.get('perma_id'));
  },

  pageLinkPlaceholderDroppedOnPage: function(links, page) {
    links.addLink(page.get('perma_id'));
  },

  successorLinkSelected: function (link) {
    this.selection.select('successorLinks', [link]);
  },

  successorLinkDroppedOnPage: function(page, targetPage) {
    if (targetPage) {
      page.configuration.set('scroll_successor_id', targetPage.get('perma_id'));
    }
    else {
      page.configuration.unset('scroll_successor_id');
    }
  },

  chaptersPositioned: function(updates) {
    // FIXME should have batch update for chapters
    _.each(updates, function(update) {
      update.chapter.configuration.set({
        row: update.row,
        lane: update.lane
      });
    }, this);
  },

  pagesMoved: function(pagesGroupedByChapters) {
    window.console.log(pagesGroupedByChapters);
  },

  // FIXME, remove sitemap models
  addPageAfter: function (page) {
    var sitemapPage = this._page('after', 0, 0);
    var chapter = page.group().get('chapter');

    chapter.once('sync', function() {
      this.showPageInSidebar(sitemapPage);
    }, this);

    // Create new pageflow page
    var pageflowPage = chapter.addPage({
      position: page.index()
    });

    sitemapPage.set('page', pageflowPage);
    pageflowPage.sitemapPage = sitemapPage;

    page.group().addPageAfter(sitemapPage, page);
  },

  addChapter: function(options) {
    var chapter = pageflow.entry.addChapter({configuration: options});

    chapter.once('sync', function() {
      chapter.addPage();
    });
  },

  addUpdateHandler: function (handler) {
    var that = this;

    handler(pageflow.entry, this.selection);

    pageflow.chapters.on('add remove change:configuration', function() {
      handler(pageflow.entry, that.selection);
    });

    pageflow.pages.on('add remove change:configuration', function() {
      handler(pageflow.entry, that.selection);
    });

    this.selection.on('change', function() {
      handler(pageflow.entry, that.selection);
    });
  }
});
