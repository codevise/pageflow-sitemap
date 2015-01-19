//= require_self

//= require d3.v3.js
//
//= require_tree ./editor/models
//= require ./editor/controllers/abstract_controller.js
//= require_tree ./editor/controllers
//= require_tree ./editor/templates
//= require ./editor/d3.js
//= require_tree ./editor/views

//
/*global $, sitemap, JST, data, pageflow, Backbone, Marionette, Graph, SitemapView, console, _*/

(function() {
  window.sitemap = window.sitemap || {};

  sitemap.showSelection = function () {
    sitemap.selectPage()
      .done(function (selected) {
        console.log('selected', selected);
      })
      .fail(function () {
        console.log('nothing selected');
      });
  };

  pageflow.editor.registerMainMenuItem({
    translationKey: 'sitemap',
    click: function() {
      sitemap.show();
    }
  });

  pageflow.editor.selectPage = sitemap.selectPage = function () {
    var result = $.Deferred(),
      graph = sitemap.graphFactory(pageflow.chapters),
      binding = new sitemap.EntryToGraphBinding(pageflow.chapters, pageflow.pages, graph),
      graphView = new sitemap.GraphSelectionView({ data: graph });

    graphView.controller.once('selected', function (selected) {
      graphView.remove();
      result.resolve(selected);
    });

    graphView.once('closed', _.bind(result.reject, result));

    pageflow.editor.showViewInMainPanel(graphView);

    return result.promise();
  };

  sitemap.show = function () {
    if (!sitemap.editor) {
      createSitemap();
    }

    sitemap.editor.show();
    pageflow.editor.showViewInMainPanel(sitemap.editor);
  };

  sitemap.hide = function () {
    if (sitemap.editor) {
      sitemap.editor.hide();
    }
  };

  function createSitemap() {
    var graph = sitemap.graphFactory(pageflow.chapters);
    new sitemap.EntryToGraphBinding(pageflow.chapters, pageflow.pages, graph);
    sitemap.editor = new sitemap.SitemapView({ data: graph });
  }
}());
