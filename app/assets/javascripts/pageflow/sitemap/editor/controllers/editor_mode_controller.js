pageflow.sitemap.EditorModeController = pageflow.sitemap.AbstractController.extend({
  name: 'editor_mode',

  initialize: function() {
    var s = pageflow.sitemap;

    this.selection = new s.Selection();

    new s.FragmentParser(
      pageflow.entry,
      Backbone.history.fragment
    ).select(this.selection);

    new s.SelectionNavigator({
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
    if (!this.selection.contains(page)) {
      this.selection.select('pages', [page], {
        additive: event.ctrlKey
      });
    }
  },

  pageDblClick: function(page) {
    this.trigger('showPage', page);
  },

  pageLinkSelected: function (pageLink) {
    this.selection.select('pageLinks', [pageLink]);
  },

  pageLinkDroppedOnPage: function(links, link, page) {
    links.updateLink(link, page.get('perma_id'));
  },

  newPageLinkDroppedOnPage: function(links, page) {
    links.addLink(page.get('perma_id'));
  },

  pageLinkDroppedOnPlaceholder: function(sourcePage, links, link, laneAndRow) {
    var configuration = _.extend({
      parent_page_perma_id: sourcePage.get('perma_id')
    }, laneAndRow);

    this.addChapter(configuration).then(function(page) {
      page.once('sync', function() {
        links.updateLink(link, page.get('perma_id'));
      });
    });
  },

  newPageLinkDroppedOnPlaceholder: function(sourcePage, links, laneAndRow) {
    var configuration = _.extend({
      parent_page_perma_id: sourcePage.get('perma_id')
    }, laneAndRow);

    this.addChapter(configuration).then(function(page) {
      page.once('sync', function() {
        links.addLink(page.get('perma_id'));
      });
    });
  },

  successorLinkSelected: function (link) {
    this.selection.select('successorLinks', [link]);
  },

  successorLinkDroppedOnPage: function(page, targetPage) {
    if (targetPage && targetPage !== page) {
      page.configuration.set('scroll_successor_id', targetPage.get('perma_id'));
    }
    else {
      page.configuration.set('scroll_successor_id', null);
    }
  },

  successorLinkDroppedOnPlaceholder: function(page, laneAndRow) {
    var configuration = _.extend({
      parent_page_perma_id: page.chapter.configuration.get('parent_page_perma_id')
    }, laneAndRow);

    this.addChapter(configuration).then(function(newPage) {
      newPage.once('sync', function() {
        page.configuration.set('scroll_successor_id', newPage.get('perma_id'));
      });
    });
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

  pagesMoved: function(pagesGroupedByChapters, laneAndRow) {
    _.each(pagesGroupedByChapters, function(update) {
      if (!update.chapter &&
          update.pages.length === update.pages[0].chapter.pages.length) {

        update.pages[0].chapter.configuration.set(laneAndRow);
        return;
      }

      var chapter = update.chapter || pageflow.entry.addChapter({configuration: laneAndRow});

      _.each(update.pages, function(page, index) {
        page.set('position', index);

        if (page.chapter !== chapter) {
          page.chapter.pages.remove(page);
          chapter.pages.add(page);
        }
      });

      chapter.pages.sort();

      whenSaved(chapter, function() {
        chapter.pages.saveOrder();
      });
    });

    function whenSaved(chapter, fn) {
      if (chapter.isNew()) {
        chapter.once('sync', fn);
      }
      else {
        fn();
      }
    }
  },

  addPage: function (chapter) {
    var page = chapter.addPage();
    var selection = this.selection;

    page.once('sync', function() {
      selection.select('pages', [page]);
    });
  },

  insertPageAfter: function (targetPage) {
    var chapter = targetPage.chapter;
    var selection = this.selection;
    var delta = 0;

    chapter.pages.each(function(page, index) {
      page.set('position', index + delta);

      if (page === targetPage) {
        delta = 1;
      }
    });

    var newPage = chapter.addPage({
      position: targetPage.get('position') + 1
    });

    chapter.pages.sort();
    chapter.pages.saveOrder();

    newPage.once('sync', function() {
      selection.select('pages', [newPage]);
    });
  },

  addChapter: function(configuration) {
    var chapter = pageflow.entry.addChapter({configuration: configuration});

    return new $.Deferred(function(deferred) {
      chapter.once('sync', function() {
        deferred.resolve(chapter.addPage());
      });
    }).promise();
  },

  addDebouncedUpdateHandler: function (handler) {
    var session = {
      entry: pageflow.entry,
      selection: this.selection
    };

    handler(session);

    this.listenTo(pageflow.chapters, 'remove', function() {
      this.selection.reset();
    });

    this.listenTo(pageflow.pages, 'destroying', function() {
      this.selection.reset();
    });

    this.listenTo(pageflow.chapters, 'add remove destroying change change:configuration', function() {
      handler(session);
    });

    this.listenTo(pageflow.pages, 'add remove destroying destroy change change:configuration', function() {
      handler(session);
    });

    this.listenTo(this.selection, 'change', function() {
      handler(session);
    });
  }
});
