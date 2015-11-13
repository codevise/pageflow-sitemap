(function() {
  var KEY_SHIFT = 16;
  var KEY_CTRL = 17;

  sitemap.ScrollPaneView = Backbone.Marionette.View.extend({
    className: 'scroll_pane',

    events: {
      mousedown: function(event) {
        this.scrolling = true;
        this.lastX = event.pageX;
        this.lastY = event.pageY;
      },

      mousemove: function(event) {
        if (!event.ctrlKey) {
          this.deactivate();
        }

        if (this.scrolling) {
          var diffX = event.pageX - this.lastX;
          var diffY = event.pageY - this.lastY;

          this.options.graphView.scrollBy(diffX, diffY);

          this.lastX = event.pageX;
          this.lastY = event.pageY;
        }
      },

      mouseup: function(event) {
        this.scrolling = false;
      },
    },

    initialize: function() {
      this.keydownHandler = _.bind(this.onKeydown, this);
      this.keyupHandler = _.bind(this.onKeyup, this);

      $(document).on('keydown', this.keydownHandler);
      $(document).on('keyup', this.keyupHandler);
    },

    onClose: function() {
      $(document).off('keydown', this.keydownHandler);
      $(document).off('keyup', this.keyupHandler);
    },

    onKeydown: function(event) {
      if ((event.which === KEY_CTRL && event.shiftKey) ||
          (event.which === KEY_SHIFT && event.ctrlKey)) {
        this.activate();
      }
    },

    onKeyup: function(event) {
      if (event.which === KEY_CTRL || event.which === KEY_SHIFT) {
        this.deactivate();
      }
    },

    activate: function() {
      this.$el.addClass('active');
      document.body.style.cursor = 'move';
    },

    deactivate: function() {
      this.scrolling = false;
      this.$el.removeClass('active');
      document.body.style.cursor = 'default';
    }
  });
}());