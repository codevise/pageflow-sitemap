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
/*global $, graphEditor, JST, data, pageflow, Backbone, Marionette, Graph, GraphEditorView, console, _*/

(function() {
  window.graphEditor = {};

  pageflow.editor.registerMainMenuItem({
    translationKey: 'sitemap',
    click: function() {
      graphEditor.show();
    }
  });

  function getGraph() {
    var graph = Graph.create();

    var lastLaneIndex = 0;
    _(pageflow.chapters.groupBy(function(c) { return c.configuration.get('lane') || 0; })).forEach(function(chapters, laneIndex) {

      for(;lastLaneIndex < laneIndex-1; lastLaneIndex++) {
        graph.lane().end();
      }
      lastLaneIndex = laneIndex;

      var lane = graph.lane();

      _(chapters).sortBy(function(c) {
        return c.configuration.get('row');
      }).forEach(function(chapter) {
        var group = lane.group(chapter);
        var row = chapter.configuration.get('row');
        if (_.isNumber(row)) {
          group.row(row);
        }
        chapter.pages.forEach(function(page) {
          group.page(page).end();
        });
        group.end();
      });
      lane.end();
    });

    return graph.end();
  }

  graphEditor.show = function () {
    var graph = getGraph();
    var graphEditorView = new graphEditor.GraphEditorView({ data: graph });

    pageflow.chapters.on('add', function(chapter) {
      // TODO: Update graph when page is added in pageflow editor

      // var found = _(graph.get('lanes')).find(function (lane) {
      //   return lane.find(function (group) { return group.get('chapter') == chapter; });
      // });

      // if (!found) {
      //    graph.addGroupForChapter(chapter);
      // }

      // pageflow.editor.showViewInMainPanel(new graphEditor.GraphEditorView({ data: getGraph() }));
    });

    pageflow.pages.on('change:configuration', function() {
      // TODO:  Just update appropriate page don't reconstruct whole graph.
      pageflow.editor.showViewInMainPanel(new graphEditor.GraphEditorView({ data: getGraph() }));
    });

    pageflow.editor.showViewInMainPanel(graphEditorView);
  };

  graphEditor.hide = function () {
    pageflow.editor.showPreview();
  };
}());
