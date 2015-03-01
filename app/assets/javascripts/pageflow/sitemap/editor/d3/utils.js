pageflow.sitemap.utils = {
  size: function(selection, w, h) {
    selection
      .attr('width', w)
      .attr('height', h);
  },

  fn: {
    d: function(property) {
      return function(d) {
        return d[property];
      };
    },

    translate: function(x, y) {
      return function(d) {
        return 'translate(' + d[x] + ',' + d[y] + ')';
      };
    },

    trigger: function(fn) {
      return function(d) {
        if (typeof fn === 'function') {
          fn.apply(this, arguments);
        }
      };
    }
  }
};
