pageflow.sitemap.groupView = {
  define: function(className, fn) {
    var s = pageflow.sitemap;

    return function(data, options) {
      options = options || {};

      return function(container) {
        var nodes = container
          .selectAll('.' + className)
          .data(data, s.utils.fn.d('id'))
          .order();

        var nodesEnter = nodes
          .enter()
          .append('g');

        nodesEnter
          .attr('id', s.utils.fn.d('id'))
          .classed(className, true);

        fn.call({
          options: options || {},

          enter: function() {
            return nodesEnter;
          },

          update: function() {
            return nodes;
          },

          child: childFactory(nodesEnter, nodes, options)
        }, pageflow.sitemap);

        nodes.exit()
          .remove();
      };
    };

    function childFactory(nodesEnter, nodes, options) {
      return function(selector, fn) {
        var components = selector.split('.');
        var tagName = components[0];
        var className = components[1];

        var enteredChild = nodesEnter
          .append(tagName)
          .attr('class', className);

        var child = nodes.select(selector);

        fn.call({
          options: options,

          enter: function() {
            return enteredChild;
          },

          update: function() {
            return child;
          },
        });

        return child;
      };
    }
  }
};