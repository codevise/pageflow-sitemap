/*globals _, sitemap, pageflow */

sitemap.AbstractController = pageflow.Object.extend({
  chapterSelected: function (chapter, event) {},

  chaptersSelected: function (chapters) {},

  pageSelected: function (page, event) {},

  pageDblClick: function (page, event) {},

  pageLinkSelected: function (pageLink) {},

  pageLinkDroppedOnPage: function(links, link, page) {},

  pageLinkPlaceholderDroppedOnPage: function(links, page) {},

  successorLinkSelected: function (link) {},

  successorLinkDroppedOnPage: function(page, targetPage) {},

  chaptersPositioned: function(updates) {},

  pagesMoved: function(pagesGroupedByChapters) {},

  addPage: function (chapter) {},

  insertPageAfter: function (page) {},

  addChapter: function(options) {},

  addUpdateHandler: function (handler) {
    var timeout;

    this.addDebouncedUpdateHandler(function(/* args */) {
      var args = arguments;

      timeout = timeout || setTimeout(function() {
        timeout = null;
        handler.apply(this, args);
      }, 1);
    });
  },

  addDebouncedUpdateHandler: function(handler) {},

  dispose: function() {
    this.stopListening();
  }
});

_.extend(sitemap.AbstractController, Backbone.Events);