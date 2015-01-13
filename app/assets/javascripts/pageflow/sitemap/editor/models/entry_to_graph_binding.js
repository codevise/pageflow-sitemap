/*global s pageflow, sitemap, Group, PageCollection, pageflow, Page, _, console, Knob*/

sitemap.EntryToGraphBinding = pageflow.Object.extend({

  chapterEvents: {
    'add': function(chapter) {
      chapter.once('sync', function () {
        // If a chapter is added from outside, that is currently not
        // represented in the graph we simply add it to the end of the
        // first lane and assumme that it is empty or corresponding add
        // page events get triggered

        var group = chapter.sitemapGroup;
        if (!group) {
          chapter.once('sync', function () {
            group = new Group({
              chapter: chapter,
              pages: new PageCollection()
            });
            this.graph.lane(0).add(group);
          }, this);
        }
      }, this);
    },
    'change:title': function(model, title) {
      // d3view takes data directly from backbone model.
      // sitemapGroup still seemingly needs to be updated so that d3 detects a change
      model.sitemapGroup.set('title', title);
      this.graph.trigger('change');
    },
    'remove': function(model) {
      model.once('sync', function() {
        var group = model.sitemapGroup;
        if (group) {
          group.removeFromLane();
        }
      }, this);
    }
  },

  pageEvents: {
    'add': function (page) {
      page.once('sync', function () {
        // TODO: replace this with correct page creation
        var sitemapPage = page.sitemapPage;

        if (!sitemapPage) {
          sitemapPage = new Page({
            page: page,
            name: page.id,
            title: page.configuration.get('title') || "Kein Titel"
          });

          var group = page.chapter.sitemapGroup;
          if (!group) {
            group = new Group({
              chapter: page.chapter,
              pages: new PageCollection([sitemapPage])
            });
          }
          else {
            group.pushPage(sitemapPage);
          }
        }
      }, this);
    },
    'change:configuration': function(page) {
      // This updates the title only.
      var title = page.configuration.get('title');
      page.sitemapPage.set('title', title);
      this.graph.trigger('change');
    },
    'change:template': function(page) {
      var knobs = page.sitemapPage.get('knobs');
      knobs.reset();
      var pageLinks = page.pageLinks();
      if (pageLinks) {
        var knob = new Knob({name: 'default'}, {pageLinks: pageLinks});
        knobs.add(knob);
      }
    },
    'remove': function(page) {
      page.once('sync', function() {
        var sp = page.sitemapPage;
        if (sp.collection) {
          sp.collection.remove(sp);
        }
        this.graph.trigger('change');
      }, this);
    }
  },

  initialize: function (chapters, pages, graph) {
    this.chapters = chapters;
    this.pages = pages;
    this.graph = graph;

    this._listenTo(chapters, this.chapterEvents);
    this._listenTo(pages, this.pageEvents);
  },

  _listenTo: function (other, events) {
    _.each(events, function(callback, event) {
      this.listenTo(other, event, callback);
    }, this);
  }
});
