pageflow.features.register('editor', 'sitemap', function(config) {
  config.registerMainMenuItem({
    translationKey: 'sitemap',
    click: function() {
      sitemap.show();
    }
  });
});