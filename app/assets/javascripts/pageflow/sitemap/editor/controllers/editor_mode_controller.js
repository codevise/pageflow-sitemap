/*global pageflow, sitemap, Backbone, confirm, Group, _, Page*/

sitemap.EditorModeController = sitemap.AbstractController.extend({
  initialize: function(graph) {
    this.graph = graph;
    this.selection = new Backbone.Model({groups: []});
  },

  groupSelected: function (group) {
    this.showGroupInSidebar(group);
    this.selection.set('groups', [group]);
  },

  groupsSelected: function (groups) {
    this.selection.set('groups', groups);
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

  groupsPositioned: function(updates) {
    _.each(updates, function(update) {
      this.graph.moveGroupTo(this.graph.lane(update.lane), update.row, update.group);
    }, this);
  },

  pageSelected: function (page) {
    this.showPageInSidebar(page);
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
    knob.linkTo(page);
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

  showGroupInSidebar: function (sitemapGroup) {
    var chapter = sitemapGroup.get('chapter'),
      id = chapter.get('id');

    pageflow.editor.navigate('/chapters/' + id, {trigger: true});
  },

  _page: function (name, x, y) {
    return new Page({ x0: x, y0: y, title: 'Kein Titel' });
  },

  addUpdateHandler: function (handler) {
    var that = this;
    handler(this.graph, this.selection);

    var updateTimeout;
    this.graph.on('change', function () {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(_.bind(handler, this, this, that.selection), 100);
    });

    this.selection.on('change', function() {
      handler(that.graph, that.selection);
    });
  }
});
