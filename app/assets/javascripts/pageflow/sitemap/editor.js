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
        graphView = new sitemap.GraphSelectionView({
          data: getGraph()
        });

    graphView.controller.once('selected', function (selected) {
      graphView.remove();
      result.resolve(selected);
    });

    graphView.once('closed', result.reject);

    pageflow.editor.showViewInMainPanel(graphView);

    return result.promise();
  };

  sitemap.show = function () {
    pageflow.editor.showViewInMainPanel(new sitemap.SitemapView({
      data: getGraph()
    }));
  };

  sitemap.hide = function () {
    if (sitemap.editor) {
      sitemap.editor.hide();
    }
  };

  function getGraph() {
    if (!sitemap.graph) {
      sitemap.graph = sitemap.graphFactory(pageflow.chapters);
      sitemap.binding = new sitemap.EntryToGraphBinding(pageflow.chapters, pageflow.pages, sitemap.graph);
    }

    return sitemap.graph;
  }
}());
