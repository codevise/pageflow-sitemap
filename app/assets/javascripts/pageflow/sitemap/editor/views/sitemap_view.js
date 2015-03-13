sitemap.SitemapView = Backbone.Marionette.ItemView.extend({
  className: 'container sitemap',
  template: 'pageflow/sitemap/editor/templates/sitemap',

  ui: {
    scrollBarX: '.scroll_bar_x',
    scrollBarY: '.scroll_bar_y',
    scaleSlider: '.scale_slider',
    toolbarItems: '.toolbar .items',
    closeButton: '.close.button',
    header: 'h2'
  },

  events: {
    'click .close.button': function() {
      this.trigger('closed');
      this.close();
    },

    'click .toolbar .items': function(event) {
      _(this.options.toolbarItems).each(function(item) {
        if (item.name === $(event.target).data('name')) {
          item.click();
        }
      });
    }
  },

  initialize: function() {
    this.listenTo(this, 'close', function() {
      this.graphView.on('change.scaleSlider', null);
      sitemap.SitemapView.lastViewport = this.graphView.getViewport();
    });

    this.listenTo(this.options.controller, 'showPage', function(page) {
      this.close();
    });
  },

  onRender: function() {
    this.$el.addClass(this.options.controller.name);

    this.graphView = new sitemap.GraphView(this.$el.find('svg')[0], this.options.controller, {
                                             defaultViewport: sitemap.SitemapView.lastViewport
                                           });

    this.listenTo(pageflow.app, 'resize', this.graphView.resize);

    this.setupHeader();
    this.setupScrollBars();
    this.setupScaleSlider();
    this.setupToolbar();
  },

  onShow: function() {
    this.graphView.resize();
  },

  setupHeader: function() {
    this.ui.closeButton.text(I18n.t('pageflow.sitemap.editor.templates.sitemap.' + (this.options.cancelButton ? 'cancel' : 'close')));
    this.ui.header.text(this.options.headerText);
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
  },

  setupToolbar: function() {
    var view = this;

    _(this.options.toolbarItems).each(function(item) {
      var link = $('<a />');

      link.text(I18n.t('pageflow.sitemap.editor.toolbar_items.' + item.name));
      link.addClass(item.name);
      link.data('name', item.name);

      view.ui.toolbarItems.append(link);
    });
  }
});
