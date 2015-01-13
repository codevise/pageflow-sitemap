/*global sitemap, Backbone, pageflow, data*/

sitemap.GraphSelectionView = Backbone.Marionette.ItemView.extend({
  className: 'container',
  template: 'pageflow/sitemap/editor/templates/graph',

  events: {
    "click .close.button": function() {
      this.trigger('closed');
      this.remove();
    }
  },

  initialize: function(options) {
    this.data = options.data;
    this.controller = new sitemap.SelectionModeController(options.data);
  },

  onRender: function() {
    var svgElement = this.$el.find('svg')[0];
    new sitemap.GraphView(svgElement, this.controller);

    pageflow.app.on('resize', sitemap.pan.resize);
    setTimeout(sitemap.pan.resize, 250);
  }
});
