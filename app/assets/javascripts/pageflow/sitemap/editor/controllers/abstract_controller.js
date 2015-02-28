/*globals _, sitemap, pageflow */

sitemap.AbstractController = pageflow.Object.extend({
  chapterSelected: function (chapter, event) {},

  chaptersSelected: function (chapters) {},

  pageSelected: function (page, event) {},

  pageLinkSelected: function (pageLink) {},

  pageLinkDroppedOnPage: function(links, link, page) {},

  pageLinkPlaceholderDroppedOnPage: function(links, page) {},

  successorLinkSelected: function (link) {},

  successorLinkDroppedOnPage: function(page, targetPage) {},

  chaptersPositioned: function(updates) {},

  pagesMoved: function(pagesGroupedByChapters) {},

  addPageAfter: function (page) {},

  addChapter: function(options) {},

  addUpdateHandler: function (handler) {}
});

_.extend(sitemap.AbstractController, Backbone.Events);