/*globals graphEditor, pageflow */

graphEditor.SelectionModeController = graphEditor.AbstractController.extend({
  pageSelected: function (sitemapPage) {
    this.trigger('selected', sitemapPage.page());
  }
});
