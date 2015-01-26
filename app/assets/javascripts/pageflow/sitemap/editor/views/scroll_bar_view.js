sitemap.ScrollBarView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/sitemap/editor/templates/scroll_bar',

  ui: {
    slider: '.slider'
  },

  onRender: function() {
    this.$el.addClass('scroll_bar');

    this.setupSlider();
  },

  onClose: function() {
    this.options.graphView.on(this.graphViewChangeEvent, null);
  },

  setupSlider: function() {
    var graphView = this.options.graphView;
    var view = this;
    var coord = this.options.orientation === 'vertical' ? 'Y' : 'X';

    this.ui.slider.slider({
      orientation: this.options.orientation,
      slide: function(event, ui) {
        graphView['setScroll' + coord](ui.value);
      }
    });

    this.graphViewChangeEvent = 'change.scrollBar' + coord;

    this.options.graphView.on(this.graphViewChangeEvent, function() {
      view.ui.slider.slider('value', graphView['getScroll' + coord]());
      view.resizeHandle();
    });

    this.wrapHandleInHelper();
    this.resizeSliderToHelperDuringDrag();
    this.resizeHandle();
  },

  wrapHandleInHelper: function() {
    this.ui.handle = this.ui.slider.find('.ui-slider-handle');
    this.ui.handleHelper = this.ui.handle
      .wrap("<div class='ui-handle-helper-parent'></div>" )
      .parent();
  },

  resizeSliderToHelperDuringDrag: function() {
    var view = this;
    var sizeMethod = this.options.orientation === 'vertical' ? 'height' : 'width';

    this.ui.handle.on('mousedown', function() {
      view.sliding = true;

      var marginTop = view.ui.handleHelper.prop('offsetTop');
      var marginLeft = view.ui.handleHelper.prop('offsetLeft');

      view.ui.slider
        .width(view.ui.handleHelper.width())
        .height(view.ui.handleHelper.height())
        .css({
          'margin-top': marginTop + 'px',
          'margin-left': marginLeft + 'px'
        });

      view.ui.handleHelper.css({
        'margin-top': 0,
        'margin-left': 0
      });

      $(document).one('mouseup', function() {
        view.sliding = false;

        view.ui.slider
          .width('100%')
          .height('100%')
          .css({
            'margin-top': 0,
            'margin-left': 0
          });

        view.ui.handleHelper.css({
          'margin-top': marginTop + 'px',
          'margin-left': marginLeft + 'px'
        });
      });
    });
  },

  resizeHandle: function() {
    if (this.sliding) {
      return;
    }

    var handleSize;
    var handle = this.ui.slider.find('.ui-slider-handle');

    if (this.options.orientation === 'vertical') {
      handleSize = this.options.graphView.getScrollWindowProportionY() * this.$el.height();

      handle.css({
        height: handleSize,
        'margin-bottom': -handleSize / 2
      });

      this.ui.handleHelper.css({
        height: this.$el.height() - handleSize,
        'margin-top': handleSize / 2
      });

      this.ui.slider.toggle(this.options.graphView.getScrollWindowProportionY() < 1);
    }
    else {
      handleSize = this.options.graphView.getScrollWindowProportionX() * this.$el.width();

      handle.css({
        width: handleSize,
        'margin-left': -handleSize / 2
      });

      this.ui.handleHelper.css({
        width: this.$el.width() - handleSize,
        'margin-left': handleSize / 2
      });

      this.ui.slider.toggle(this.options.graphView.getScrollWindowProportionX() < 1);
    }
  }
});