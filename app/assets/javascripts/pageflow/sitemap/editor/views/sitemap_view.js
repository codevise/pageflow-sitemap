sitemap.SitemapView = Backbone.Marionette.ItemView.extend({
  className: 'container sitemap',
  template: 'pageflow/sitemap/editor/templates/sitemap',

  ui: {
    scrollBarX: '.scroll_bar_x',
    scrollBarY: '.scroll_bar_y',
    scaleSlider: '.scale_slider'
  },

  events: {
    "click .close.button": function() {
      this.trigger('closed');
      this.close();
    }
  },

  initialize: function() {
    this.listenTo(this, 'close', function() {
      this.graphView.on('change.scaleSlider', null);
    });
  },

  onRender: function() {
    var svgElement = this.$el.find('svg')[0];
    this.graphView = new sitemap.GraphView(svgElement,
                                           this.options.controller,
                                           this.options.viewModelOptions);

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
    }));

    this.subview(new sitemap.ScrollBarView({
      el: this.ui.scrollBarY,
      graphView: this.graphView,
      orientation: 'vertical'
    }));
  },

  setupScaleSlider: function() {
    var view = this;

    this.ui.scaleSlider.slider({
      slide: function(event, ui) {
        view.graphView.setScale(ui.value);
      }
    });

    this.graphView.on('change.scaleSlider', function() {
      view.ui.scaleSlider.slider('value', view.graphView.getScale());
    });
  }
});
