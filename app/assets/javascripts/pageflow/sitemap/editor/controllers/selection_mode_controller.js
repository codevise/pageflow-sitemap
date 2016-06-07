pageflow.sitemap.SelectionModeController = pageflow.sitemap.AbstractController.extend({
  name: 'selection_mode',

  initialize: function(entry, options) {
    this.entry = entry;
    this.options = options || {};
  },

  pageSelected: function (page) {
    this.trigger('selected', page);
  },

  addDebouncedUpdateHandler: function (handler) {
    var fragmentParser = new pageflow.sitemap.FragmentParser(this.entry, Backbone.history.fragment);
    var options = this.options;

    var session = {
      entry: this.entry,
      selection: new pageflow.sitemap.Selection(),
      isPageDisabled: function(page) {
        return options.isAllowed && !options.isAllowed(page);
      },
      highlightedPage: this.options.noHighlight ? null : fragmentParser.getModel('pages'),
      highlightedStoryline: this.options.noHighlight ? null : fragmentParser.getModel('storylines')
    };

    handler(session);

    this.listenTo(this.entry.chapters, 'add remove destroying change:configuration', function() {
      handler(session);
    });

    this.listenTo(this.entry.pages, 'add remove destroying destroy change change:configuration', function() {
      handler(session);
    });
  }
});
