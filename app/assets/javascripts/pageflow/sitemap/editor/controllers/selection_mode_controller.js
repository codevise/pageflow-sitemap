pageflow.sitemap.SelectionModeController = pageflow.sitemap.AbstractController.extend({
  name: 'selection_mode',

  pageSelected: function (page) {
    this.trigger('selected', page);
  },

  addUpdateHandler: function (handler) {
    var selection = new pageflow.sitemap.Selection();

    handler(pageflow.entry, selection);

    pageflow.chapters.on('add remove change:configuration', function() {
      handler(pageflow.entry, selection);
    });

    pageflow.pages.on('add remove change:configuration', function() {
      handler(pageflow.entry, selection);
    });
  }
});
