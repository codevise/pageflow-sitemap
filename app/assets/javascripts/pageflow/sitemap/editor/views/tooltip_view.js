sitemap.TooltipView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/sitemap/editor/templates/tooltip',
  className: 'sitemap_tooltip',

  ui: {
    label: '.label'
  },

  hide: function() {
    clearTimeout(this.timeout);
    this.$el.removeClass('visible');
  },

  show: function(text, position) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(_.bind(function() {
      this.ui.label.text(text);
      this.$el.css({
        top: (position.top - 17) + 'px',
        left: (position.left + 10) + 'px'
      });

      this.$el.addClass('visible');
    }, this), 200);
  }
});