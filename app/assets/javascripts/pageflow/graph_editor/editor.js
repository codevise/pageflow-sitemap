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
//= require ./editor/data.js
//= require ./editor/zoom_handler.js
//= require ./editor/pan_handler.js
//= require ./editor/drag.js
//= require ./editor/graph_view.js
//
/*global $, graphEditor, JST, data, pageflow*/


(function() {
  window.graphEditor = {};

  var preview, graph_editor;

  graphEditor.init = function() {
    // pageflow.addContentForMainView('graph_editor', svg);  <- dreamcode

    $('main .container').attr('id', 'pageflow_preview');

    var svg = JST['pageflow/graph_editor/editor/templates/graph']();
    $('main').append('<div class="container" id="graph_editor">' + svg + '</div>');

    preview = $('#pageflow_preview');
    graph_editor = $('#graph_editor');

    graph_editor.hide();

    new graphEditor.GraphView(data);

    pageflow.app.on('resize', graphEditor.pan.resize);
  };

  graphEditor.show = function () {
    preview.hide();
    graph_editor.show();
    graphEditor.pan.resize();
  };

  graphEditor.hide = function () {
    preview.show();
    graph_editor.hide();
  };

}());
