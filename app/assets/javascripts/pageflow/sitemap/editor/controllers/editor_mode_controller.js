/*global pageflow, sitemap, Backbone, confirm, Group, _, Page*/

pageflow.sitemap.EditorModeController = sitemap.AbstractController.extend({
  initialize: function(graph) {
    this.graph = graph;
    this.selection = new pageflow.sitemap.Selection();

    new pageflow.sitemap.SelectionNavigator({
      selection: this.selection,
      multiSelectionPath: '/'
    }).attach();
  },

  chapterSelected: function (chapter, event) {
    this.selection.select('chapters', [chapter], {
      additive: event.ctrlKey
    });
  },

  chaptersSelected: function (chapters) {
    this.selection.select('chapters', chapters);
  },

  pageSelected: function (page) {
    this.selection.select('pages', [page]);
  },

  pageLinkSelected: function (pageLink) {
    this.selection.select('pageLinks', [pageLink]);
  },

  // FIXME
  groupDroppedOnArea: function (group, target, position) {
    if(position == 'before') {
      this.graph.insertIntoGroupBefore(group, target);
    }
    else {
      this.graph.insertIntoGroupAfter(group, target);
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

  // FIXME
  pageDroppedOnPlaceholder: function (page, placeholder) {
    if (page.group().count() <= 1) {
      this.graph.moveGroupTo(placeholder.lane, placeholder.row, page.group());
    }
    else {
      this.graph.moveToEmptyGroup(placeholder.lane, placeholder.row, page);
    }
  },

  // FIXME
  pageDroppedOnArea: function (page, target, position) {
    if(position == 'before') {
      this.graph.movePageBefore(page, target);
    }
    else {
      this.graph.movePageAfter(page, target);
    }
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

  knobDroppedOnPage: function (knob,  page) {
    // FIXME, use pagelinks api
    knob.linkTo(page);
  },

  successorKnobDroppedOnPage: function (group,  page) {
    group.makePredecessorOf(page);
    if (page.group().get('pages').first() === page) {
      group.joinWithIfConnected(page.group());
    }
  },

  followPathSelected: function (page) {
    if (confirm("Wollen Sie den Link wirklich löschen?")) {
      page.removeSuccessorLink();
    }
  },

  successorPathSelected: function (page) {
    if (confirm("Wollen Sie den Link wirklich löschen?")) {
      page.removeSuccessorLink();
    }
  },

  // FIXME, remove sitemap models
  placeholderSelected: function (placeholder) {
    // Create sitemap group and pageflow chapter.

    // TODO: move this to the model?
    var group = Group.createGroup(placeholder.lane.index(), placeholder.row);
    var chapter = group.get('chapter');

    chapter.once('sync', function() {

      // create pageflow page via chapter
      var pageflowPage = chapter.addPage({ position: 0 });

      var sitemapPage = this._page('after', placeholder.x, placeholder.y);
      sitemapPage.set('page', pageflowPage);
      pageflowPage.sitemapPage = sitemapPage;

      pageflowPage.once('sync', function() {
        // create sitemapPage for pageflow Page
        group.addPageAt(sitemapPage, 0);
        placeholder.lane.addGroup(group, placeholder.row);
        this.graph.trigger('change');

        this.showPageInSidebar(sitemapPage);
      }, this);
    }, this);
  },

  showPageInSidebar: function (sitemapPage) {
    var page = sitemapPage.get('page'),
      pageId = page.get('id');

    pageflow.editor.navigate('/pages/' + pageId, {trigger: true});
  },

  showChapterInSidebar: function (chapter) {
    pageflow.editor.navigate('/chapters/' + chapter.id, {trigger: true});
  },

  // Should get obsolete
  _page: function (name, x, y) {
    return new Page({ x0: x, y0: y, title: 'Kein Titel' });
  },

  addUpdateHandler: function (handler) {
    var that = this;
    handler(pageflow.entry, this.selection);

    //
    //var updateTimeout;
    //this.graph.on('change', function () {
    //  clearTimeout(updateTimeout);
    //  updateTimeout = setTimeout(_.bind(handler, this, this, that.selection), 100);
    //});
    //

    pageflow.chapters.on('change:configuration', function() {
      handler(pageflow.entry, that.selection);
    });

    this.selection.on('change', function() {
      handler(pageflow.entry, that.selection);
    });
  }
});
