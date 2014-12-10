/*global graphEditor, Backbone, pageflow, data*/

graphEditor.GraphEditorView = Backbone.Marionette.ItemView.extend({
  className: 'container',
  template: 'pageflow/graph_editor/editor/templates/graph',
  onRender: function() {
    var svgElement = this.$el.find('svg')[0];
    new graphEditor.GraphView(svgElement, data);
    pageflow.app.on('resize', graphEditor.pan.resize);
    setTimeout(graphEditor.pan.resize, 250);
  }
});
