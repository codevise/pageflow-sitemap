pageflow.sitemap.SelectionModeController = pageflow.sitemap.AbstractController.extend({
  name: 'selection_mode',

  pageSelected: function (page) {
    this.trigger('selected', page);
  },

  addUpdateHandler: function (handler) {
    var fragmentParser = new pageflow.sitemap.FragmentParser(pageflow.entry, Backbone.history.fragment);

    var session = {
      entry: pageflow.entry,
      selection: new pageflow.sitemap.Selection(),
      highlightedPage: fragmentParser.getModel('pages')
    };

    handler(session);

    pageflow.chapters.on('add remove change:configuration', function() {
      handler(session);
    });

    pageflow.pages.on('add remove change:configuration', function() {
      handler(session);
    });
  }
});
