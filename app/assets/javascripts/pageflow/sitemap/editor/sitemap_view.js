/*global sitemap, Backbone, pageflow, data*/

sitemap.SitemapView = Backbone.Marionette.ItemView.extend({
  className: 'container',
  template: 'pageflow/sitemap/editor/templates/graph',

  initialize: function(options) {
    this.data = options.data;
    this.controller = new sitemap.EditorModeController(options.data);
  },

  events: {
    "click .close.button": function() {
      this.hide();
    }
  },

  onRender: function() {
    var svgElement = this.$el.find('svg')[0];
    new sitemap.GraphView(svgElement, this.controller);

    pageflow.app.on('resize', sitemap.pan.resize);
    setTimeout(sitemap.pan.resize, 250);
  },

  hide: function () {
    this.$el.hide();
  },

  show: function () {
    this.$el.show();
  }
});
