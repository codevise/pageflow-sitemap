pageflow.features.register('slideshow', 'sitemap', function() {
  pageflow.slides.scrollNavigator = new pageflow.sitemap.ScrollNavigator(pageflow.slides, pageflow.history);
});