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

sitemap.d3View = function(init) {
  var tagName;
  var className;

  var view = {
    exit: function(node) {
      node.remove();
    },
    update: function() {},
    enter: function() {},

    selector: function(name) {
      var components = name.split('.');
      tagName = components[0];
      className = components[1];
    }
  };

  var utils = {
    size: function(selection, w, h) {
      selection
      .attr("width", w)
      .attr("height", h);
    },

    fn: {
      d: function(property) {
        return function(d) {
          return d[property];
        };
      }
    }
  };

  init(view, utils);

  return function(data, options) {
    options = options || {};

    return function(container) {
      var nodes = container
        .selectAll('.' + className)
        .data(data, utils.fn.d('id'));

      var nodesEnter = nodes
        .enter()
        .append(tagName);

      nodesEnter
        .attr('id', utils.fn.d('id'))
        .classed(className, true);

      view.enter(nodesEnter, options, container);
      view.update(nodes, options);
      view.exit(nodes.exit(), options);

      var updateSubs = function updateSubs() {
        if (options.subViews) {
          options.subViews.forEach(function eachSubview(sub) {
            var suboptions = sub.options || {};
            suboptions.update = updateSubs;
            sub.view(nodes, sub.selector, sub.data, suboptions);
          });
        }
      };

      options.updateSubs = updateSubs;

      updateSubs();
    };
  };
};
