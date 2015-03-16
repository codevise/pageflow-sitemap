pageflow.features.register('editor', 'sitemap', function() {
  var s = pageflow.sitemap;
  var currentSitemapView = null;

  pageflow.editor.selectPage = function (options) {
    options = options || {};

    var result = $.Deferred();
    var controller = new s.SelectionModeController(pageflow.entry, options);
    var graphView = new s.SitemapView({
      controller: controller,
      headerText: I18n.t(options.header || 'pageflow.sitemap.editor.headers.select_page'),
      cancelButton: true
    });

    if (currentSitemapView) {
      result.always(showSitemap);
    }

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
      currentSitemapView = new s.SitemapView({
        controller: new s.EditorModeController(pageflow.entry),

        toolbarItems: [
          {
            name: 'select_start_page',
            click: function() {
              pageflow.editor.selectPage({
                header: 'pageflow.sitemap.editor.headers.select_start_page',
                noHighlight: true
              })
                .done(function(page) {
                  s.startPage.update(pageflow.entry, page);
                });
            }
          }
        ]
      });

      currentSitemapView.once('close', function() {
        currentSitemapView = null;
      });

      pageflow.editor.showViewInMainPanel(currentSitemapView);
    }
  }

  function hideSitemap() {
    currentSitemapView.close();
  }
});