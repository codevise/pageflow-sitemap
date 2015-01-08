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
//= require ./editor/graph_editor_view.js
//= require ./editor/graph_selection_view.js
//
/*global $, graphEditor, JST, data, pageflow, Backbone, Marionette, Graph, GraphEditorView, console, _*/

(function() {
  window.graphEditor = {};

  // TODO remove this
  pageflow.editor.registerMainMenuItem({
    translationKey: 'graph_selection',
    click: function() {
      graphEditor.showSelection();
    }
  });

  graphEditor.showSelection = function () {
    graphEditor.selectPage()
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
      graphEditor.show();
    }
  });

  graphEditor.selectPage = function () {
    var result = $.Deferred(),
      graph = graphEditor.graphFactory(pageflow.chapters),
      binding = new graphEditor.EntryToGraphBinding(pageflow.chapters, pageflow.pages, graph),
      graphView = new graphEditor.GraphSelectionView({ data: graph });

    graphView.controller.once('selected', function (selected) {
      graphView.remove();
      result.resolve(selected);
    });

    graphView.once('closed', _.bind(result.reject, result));

    pageflow.editor.showViewInMainPanel(graphView);

    return result.promise();
  };

  graphEditor.show = function () {
    if (!graphEditor.editor) {
      createGraphEditor();
    }

    graphEditor.editor.show();
    pageflow.editor.showViewInMainPanel(graphEditor.editor);
  };

  graphEditor.hide = function () {
    if (graphEditor.editor) {
      graphEditor.editor.hide();
    }
  };

  function createGraphEditor() {
    var graph = graphEditor.graphFactory(pageflow.chapters);
    new graphEditor.EntryToGraphBinding(pageflow.chapters, pageflow.pages, graph);
    graphEditor.editor = new graphEditor.GraphEditorView({ data: graph });
  }
}());
