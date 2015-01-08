/*global graphEditor, Backbone, pageflow, data*/

graphEditor.GraphSelectionView = Backbone.Marionette.ItemView.extend({
  className: 'container',
  template: 'pageflow/graph_editor/editor/templates/graph',

  events: {
    "click .close.button": function() {
      this.trigger('closed');
      this.remove();
    }
  },

  initialize: function(options) {
    this.data = options.data;
    this.controller = new graphEditor.SelectionModeController(options.data);
  },

  onRender: function() {
    var svgElement = this.$el.find('svg')[0];
    new graphEditor.GraphView(svgElement, this.controller);

    pageflow.app.on('resize', graphEditor.pan.resize);
    setTimeout(graphEditor.pan.resize, 250);
  }
});
