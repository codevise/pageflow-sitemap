//= require_self

//= require ./editor/d3.v3.js
//= require ./editor/options.js

//= require ./editor/knob.js
//= require ./editor/link.js
//= require ./editor/page.js
//= require ./editor/group.js
//= require ./editor/lane.js
//= require ./editor/graph_factory.js
//= require ./editor/graph.js

//= require ./editor/entry_to_graph_binding.js

//= require_tree ./editor/templates

//= require ./editor/abstract_controller.js
//= require ./editor/editor_mode_controller.js
//= require ./editor/selection_mode_controller.js

//= require ./editor/d3_view.js
//= require ./editor/views.js
//= require ./editor/group_view.js
//= require ./editor/page_menu_view.js
//= require ./editor/knob_view.js
//= require ./editor/successor_knob_view.js
//= require ./editor/page_views.js
//= require ./editor/paths.js
//= require ./editor/linkpath.js
//= require ./editor/grid.js
//= require ./editor/zoom_handler.js
//= require ./editor/pan_handler.js
//= require ./editor/drag.js
//= require ./editor/graph_view.js
//= require ./editor/sitemap_view.js
//= require ./editor/graph_selection_view.js
//
/*global $, sitemap, JST, data, pageflow, Backbone, Marionette, Graph, SitemapView, console, _*/

(function() {
  window.sitemap = {};

  // TODO remove this
  pageflow.editor.registerMainMenuItem({
    translationKey: 'graph_selection',
    click: function() {
      sitemap.showSelection();
    }
  });

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

  sitemap.selectPage = function () {
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
