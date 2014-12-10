//= require_self

//= require ./editor/d3.v3.js
//= require ./editor/options.js

//= require ./editor/knob.js
//= require ./editor/link.js
//= require ./editor/page.js
//= require ./editor/group.js
//= require ./editor/lane.js
//= require ./editor/graph.js

//= require_tree ./editor/templates

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
//
/*global $, graphEditor, JST, data, pageflow, Backbone, Marionette, Graph, GraphEditorView, console*/

(function() {
  window.graphEditor = {};

  window.btn = function() {
    if (!$('#graphbtn').length) {
      $('sidebar .container').append($('<a class="add_chapter" id="graphbtn">Graph</div>'));
    }

    var on = false;

    $('#graphbtn').click(function() {
      if (on) {
        graphEditor.hide();
      }
      else {
        graphEditor.show();
      }

      on = !on;
    });
  };

  function getGraph() {
    var graph = Graph.create();

    pageflow.chapters.forEach(function(chapter) {
      var group = graph.lane().group(chapter);
      chapter.pages.forEach(function(page) {
        group.page(page.cid, page.configuration.get('title') || 'No Title').end();
      });
      group.end().end();
    });

    return graph.end();
  }

  graphEditor.show = function () {
    pageflow.chapters.on('change', function() {
      pageflow.editor.showViewInMainPanel(new graphEditor.GraphEditorView({ data: getGraph() }));
    });

    pageflow.pages.on('all', function() {
      pageflow.editor.showViewInMainPanel(new graphEditor.GraphEditorView({ data: getGraph() }));
    });


    pageflow.editor.showViewInMainPanel(new graphEditor.GraphEditorView({ data: getGraph() }));
  };

  graphEditor.hide = function () {
    pageflow.editor.showPreview();
  };
}());
