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
    }
  }
};
