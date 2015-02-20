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
  pageflow.sitemap = pageflow.sitemap || {};
  window.sitemap = window.sitemap || pageflow.sitemap;

  pageflow.editor.registerMainMenuItem({
    translationKey: 'sitemap',
    click: function() {
      sitemap.show();
    }
  });

  pageflow.editor.selectPage = sitemap.selectPage = function () {
    var result = $.Deferred(),
        controller = new sitemap.SelectionModeController(getGraph()),
        graphView = new sitemap.SitemapView({
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

  sitemap.show = function () {
    pageflow.editor.showViewInMainPanel(new sitemap.SitemapView({
      controller: new sitemap.EditorModeController(getGraph())
    }));
  };

  function getGraph() {
    if (!sitemap.graph) {
      sitemap.graph = sitemap.graphFactory(pageflow.chapters);
      sitemap.binding = new sitemap.EntryToGraphBinding(pageflow.chapters, pageflow.pages, sitemap.graph);
    }

    return sitemap.graph;
  }
}());
