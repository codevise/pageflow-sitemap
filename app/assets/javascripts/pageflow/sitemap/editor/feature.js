pageflow.features.register('editor', 'sitemap', function() {
  pageflow.editor.selectPage = function () {
    var result = $.Deferred(),
        controller = new pageflow.sitemap.SelectionModeController(pageflow.entry),
        graphView = new pageflow.sitemap.SitemapView({
          controller: controller,
          viewModelOptions: {hideKnobs: true}
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
      pageflow.editor.showViewInMainPanel(new pageflow.sitemap.SitemapView({
        controller: new pageflow.sitemap.EditorModeController(pageflow.entry)
      }));
    }
  });
});