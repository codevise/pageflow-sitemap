pageflow.sitemap.SelectionModeController = pageflow.sitemap.AbstractController.extend({
  name: 'selection_mode',

  initialize: function(entry, options) {
    this.entry = entry;
    this.options = options || {};
  },

  pageSelected: function (page) {
    this.trigger('selected', page);
  },

  addUpdateHandler: function (handler) {
    var fragmentParser = new pageflow.sitemap.FragmentParser(this.entry, Backbone.history.fragment);

    var session = {
      entry: this.entry,
      selection: new pageflow.sitemap.Selection(),
      highlightedPage: this.options.noHighlight ? null : fragmentParser.getModel('pages')
    };

    handler(session);

    this.listenTo(this.entry.chapters, 'add remove change:configuration', function() {
      handler(session);
    });

    this.listenTo(this.entry.pages, 'add remove destroy change:configuration', function() {
      handler(session);
    });
  }
});
