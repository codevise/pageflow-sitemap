/*global pageflow, graphEditor */

graphEditor.GraphEditorController = pageflow.Object.extend({
  initialize: function (graph) {
    this.graph = graph;
    this.selection = new Backbone.Model();

    this.selection.on('change:page', function(selection, sitemapPage) {
      this.showPageInSidebar(sitemapPage);
      pageflow.editor.refresh(); // TODO: Why?
    }, this);

    this.selection.on('change:group', function(selection, sitemapGroup) {
      this.showGroupInSidebar(sitemapGroup);
      pageflow.editor.refresh(); // TODO: Why?
    }, this);
  },

  groupSelected: function (group) {
    this.selection.set('group', group);
  },

  groupDroppedOnPlaceholder: function (group, placeholder) {
    this.graph.moveGroupTo(placeholder.lane, placeholder.row, group);
  },

  groupDroppedOnArea: function (group, target, position) {
    if(position == 'before') {
      this.graph.insertIntoGroupBefore(group, target);
    }
    else {
      this.graph.insertIntoGroupAfter(group, target);
    }
  },

  pageSelected: function (page) {
    this.selection.set('page', page);
  },

  pageDroppedOnPlaceholder: function (page, placeholder) {
    if (page.group().count() <= 1) {
      this.graph.moveGroupTo(placeholder.lane, placeholder.row, page.group());
    }
    else {
      this.graph.moveToEmptyGroup(placeholder.lane, placeholder.row, page);
    }
  },

  pageDroppedOnArea: function (page, target, position) {
    if(position == 'before') {
      this.graph.movePageBefore(page, target);
    }
    else {
      this.graph.movePageAfter(page, target);
    }
  },

  addPageAfter: function (page, x, y) {
    var sitemapPage = this._page('after');
    var chapter = page.group().get('chapter');

    chapter.once('sync', function() {
      this.selection.set('page', sitemapPage);
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
    if (!knob.linkTo(target.page)) {
      alert('Konnte nicht verlinkt werden!\nDas Limit von ' + knob.get('limit') + ' ist ausgeschöpft.');
    }
  },

  successorKnobDroppedOnPage: function (group,  page) {
    group.makePredecessorOf(page);
    if (page.group().get('pages').first() === page) {
      group.joinWithIfConnected(page.group());
    }
  },

  linkPathSelected: function (link) {
    if (confirm("Wollen Sie den Link wirklich löschen?")) {
      link.remove();
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

  placeholderSelected: function (placeholder) {
    // Create sitemap group and pageflow chapter.

    // TODO: move this to the model?
    var group = Group.createGroup(placeholder.lane.index(), placeholder.row);
    var chapter = group.get('chapter');

    chapter.once('sync', function() {
      // create pageflow page via chapter
      var pageflowPage = chapter.addPage({ position: 0 });

      pageflowPage.once('sync', function() {
        // create sitemapPage for pageflow Page
        var sitemapPage = this._page('after', 0, 0);
        sitemapPage.set('page', pageflowPage);
        group.addPageAt(sitemapPage, 0);

        this.selection.set('page', sitemapPage);
      }, this);
    }, this);
  },

  addUpdateHandler: function (handler) {
    handler(this.graph);

    var updateTimeout;
    this.graph.on('change', function () {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(_.bind(handler, this, this), 100);
    });
  },

  showPageInSidebar: function (sitemapPage) {
    var page = sitemapPage.get('page'),
      pageId = page.get('id');

    pageflow.editor.navigate('/pages/' + pageId, {trigger: true});
  },

  showGroupInSidebar: function (sitemapGroup) {
    var chapter = sitemapGroup.get('chapter'),
      id = chapter.get('id');

    pageflow.editor.navigate('/chapters/' + id, {trigger: true});
  },

  _page: function (name, d) {
    return new Page({ x0: d.x, y0: d.y, name: name });
  }
});
