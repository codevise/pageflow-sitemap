/*global sitemap, _*/

sitemap.D3View = function(init) {
  var defaults = {
    idfunc: function(d) { return d.id; },
    exit: function(node) {
      node.remove();
    },
    update: function() { },
    enter: function() { },
    size: function(selection, w, h) {
      selection
      .attr("width", w)
      .attr("height", h);
    }
  };

  init(defaults);

  return function(container, selector, data, options) {
    options = options || {};

    var node = container.selectAll(selector)
       .data(data, defaults.idfunc);

    defaults.enter(node.enter(), options, container);
    defaults.update(node, options);
    defaults.exit(node.exit(), options);

    var updateSubs = function updateSubs() {
      if (options.subViews) {
        options.subViews.forEach(function eachSubview(sub) {
          var suboptions = sub.options || {};
          suboptions.update = updateSubs;
          sub.view(node, sub.selector, sub.data, suboptions);
        });
      }
    };

    options.updateSubs = updateSubs;

    updateSubs();
  };
};
