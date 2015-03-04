pageflow.features.register('editor', 'sitemap', function() {
  pageflow.editor.selectPage = function () {
    var result = $.Deferred(),
        controller = new pageflow.sitemap.SelectionModeController(pageflow.entry),
        graphView = new pageflow.sitemap.SitemapView({
          controller: controller
        });

    controller.once('selected', function (selected) {
      graphView.close();
      result.resolve(selected);
    });

    graphView.once('closed', result.reject);

    pageflow.editor.showViewInMainPanel(graphView);

    return result.promise();
  };

  pageflow.editor.registerMainMenuItem({
    translationKey: 'pageflow.sitemap.editor.main_menu_item',
    click: function() {
      showSitemap();
    }
  });

  $(document).on('keydown', function(event) {
    if (event.altKey && event.which === 83) {
      toggleSitemap();
    }
  });

  var currentSitemapView = null;

  function toggleSitemap() {
    if (currentSitemapView) {
      hideSitemap();
    }
    else {
      showSitemap();
    }
  }

  function showSitemap() {
    if (!currentSitemapView) {
      currentSitemapView = new pageflow.sitemap.SitemapView({
        controller: new pageflow.sitemap.EditorModeController(pageflow.entry)
      });

      pageflow.editor.showViewInMainPanel(currentSitemapView);
    }
  }

  function hideSitemap() {
    currentSitemapView.close();
    currentSitemapView = null;
  }
});