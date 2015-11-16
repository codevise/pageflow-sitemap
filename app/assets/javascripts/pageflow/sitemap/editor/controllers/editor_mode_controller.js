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

  storylinesSelected: function (storylines) {
    this.selection.select('storylines', storylines);
  },

  storylineSelected: function (storyline, event) {
    if (!this.selection.contains(storyline)) {
      this.selection.select('storylines', [storyline], {
        additive: event.ctrlKey
      });
    }
  },

  storylineDblClick: function(storyline) {
    this.trigger('showStoryline', storyline);
  },

  chapterSelected: function (chapter, event) {
    if (!this.selection.contains(chapter)) {
      this.selection.select('chapters', [chapter], {
        additive: event.ctrlKey
      });
    }
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

    this.addStoryline(configuration).then(function(page) {
      links.updateLink(link, page.get('perma_id'));
    });
  },

  newPageLinkDroppedOnPlaceholder: function(sourcePage, links, laneAndRow) {
    var configuration = _.extend({
      parent_page_perma_id: sourcePage.get('perma_id')
    }, laneAndRow);

    this.addStoryline(configuration).then(function(page) {
      links.addLink(page.get('perma_id'));
    });
  },

  successorLinkSelected: function (link) {
    this.selection.select('successorLinks', [link]);
  },

  successorLinkDroppedOnPage: function(storyline, targetPage) {
    if (targetPage) {
      storyline.configuration.set('scroll_successor_id', targetPage.get('perma_id'));
    }
  },

  successorLinkDroppedOnPlaceholder: function(storyline, laneAndRow) {
    this.addStoryline(laneAndRow).then(function(page) {
      storyline.configuration.set('scroll_successor_id', page.get('perma_id'));
    });
  },

  storylinesPositioned: function(updates) {
    // FIXME should have batch update for chapters
    _.each(updates, function(update) {
      update.storyline.configuration.set({
        row: update.row,
        lane: update.lane
      });
    }, this);
  },

  chaptersMoved: function(chaptersGroupedByStorylines, laneAndRow) {
    _.each(chaptersGroupedByStorylines, function(update) {
      if (!update.storyline &&
          update.chapters.length === update.chapters[0].storyline.chapters.length) {

        update.chapters[0].storyline.configuration.set(laneAndRow);
        return;
      }

      var storyline = update.storyline || pageflow.entry.addStoryline({configuration: laneAndRow});
      var changeFound = false;

      _.each(update.chapters, function(chapter, index) {
        if (chapter.get('position') !== index) {
          changeFound = true;
          chapter.set('position', index);
        }

        if (chapter.storyline !== storyline) {
          changeFound = true;

          chapter.storyline.chapters.remove(chapter);
          storyline.chapters.add(chapter);
        }
      });

      if (changeFound) {
        storyline.chapters.sort();

        whenSaved(storyline, function() {
          storyline.chapters.saveOrder();
        });
      }
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

  pagesMoved: function(pagesGroupedByChapters, laneAndRow) {
    _.each(pagesGroupedByChapters, function(update) {
      if (!update.chapter &&
          update.pages.length === update.pages[0].chapter.pages.length) {

        update.pages[0].chapter.configuration.set(laneAndRow);
        return;
      }

      var chapter = update.chapter || pageflow.entry.addChapter({configuration: laneAndRow});
      var changeFound = false;

      _.each(update.pages, function(page, index) {
        if (page.get('position') !== index) {
          changeFound = true;
          page.set('position', index);
        }

        if (page.chapter !== chapter) {
          changeFound = true;

          page.chapter.pages.remove(page);
          chapter.pages.add(page);
        }
      });

      if (changeFound) {
        chapter.pages.sort();

        whenSaved(chapter, function() {
          chapter.pages.saveOrder();
        });
      }
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

  addChapter: function(storyline, configuration) {
    var chapter = storyline.addChapter({configuration: configuration});

    return new $.Deferred(function(deferred) {
      chapter.once('sync', function() {
        var page = chapter.addPage();

        page.once('sync', function() {
          deferred.resolve(page);
        });
      });
    }).promise();
  },

  insertChapterAfter: function(targetChapter) {
    var storyline = targetChapter.storyline;
    var selection = this.selection;
    var delta = 0;

    storyline.chapters.each(function(chapter, index) {
      chapter.set('position', index + delta);

      if (chapter === targetChapter) {
        delta = 1;
      }
    });

    var newChapter = storyline.addChapter({
      position: targetChapter.get('position') + 1
    });

    storyline.chapters.sort();
    storyline.chapters.saveOrder();

    newChapter.once('sync', function() {
      newChapter.addPage();
      selection.select('chapters', [newChapter]);
    });
  },

  addStoryline: function(configuration) {
    var storyline = pageflow.entry.addStoryline({configuration: configuration});
    var controller = this;

    return new $.Deferred(function(deferred) {
      storyline.once('sync', function() {
        controller.addChapter(storyline).then(deferred.resolve);
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

    this.listenTo(pageflow.storylines, 'add remove destroying change change:configuration', function() {
      handler(session);
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
