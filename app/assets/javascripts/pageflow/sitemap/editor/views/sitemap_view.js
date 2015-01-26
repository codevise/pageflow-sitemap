/*global sitemap, Backbone, pageflow, data*/

sitemap.SitemapView = Backbone.Marionette.ItemView.extend({
  className: 'container sitemap',
  template: 'pageflow/sitemap/editor/templates/graph',

  ui: {
    scrollBarX: '.scroll_bar_x',
    scrollBarY: '.scroll_bar_y',
    scaleSlider: '.scale_slider',
  },

  events: {
    "click .close.button": function() {
      this.close();
    }
  },

  initialize: function(options) {
    this.data = options.data;
    this.controller = new sitemap.EditorModeController(options.data);
  },

  onRender: function() {
    var svgElement = this.$el.find('svg')[0];
    this.graphView = new sitemap.GraphView(svgElement, this.controller);

    this.listenTo(pageflow.app, 'resize', this.graphView.resize);

    this.setupScrollBars();
    this.setupScaleSlider();
  },

  onShow: function() {
    this.graphView.resize();
  },

  setupScrollBars: function() {
    this.subview(new sitemap.ScrollBarView({
      el: this.ui.scrollBarX,
      graphView: this.graphView
    }).render());

    this.subview(new sitemap.ScrollBarView({
      el: this.ui.scrollBarY,
      graphView: this.graphView,
      orientation: 'vertical'
    }).render());
  },

  setupScaleSlider: function() {
    var view = this;

    this.ui.scaleSlider.slider({
      slide: function(event, ui) {
        view.graphView.setScale(ui.value);
      }
    });

    this.graphView.on('change', function() {
      view.ui.scaleSlider.slider('value', view.graphView.getScale());
    });
  },

  hide: function () {
    this.$el.hide();
  },

  show: function () {
    this.$el.show();
  }
});
