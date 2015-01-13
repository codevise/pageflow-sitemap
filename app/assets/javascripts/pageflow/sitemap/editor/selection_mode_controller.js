/*globals sitemap, pageflow */

sitemap.SelectionModeController = sitemap.AbstractController.extend({
  pageSelected: function (sitemapPage) {
    this.trigger('selected', sitemapPage.page());
  }
});
