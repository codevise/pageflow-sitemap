pageflow.sitemap.groupView = {
  define: function(className, fn) {
    var s = pageflow.sitemap;

    return function(data, options) {
      options = options || {};

      return function(container) {
        var nodes = container
          .selectAll('.' + className)
          .data(data, s.utils.fn.d('id'));

        var nodesEnter = nodes
          .enter()
          .append('g');

        nodesEnter
          .attr('id', s.utils.fn.d('id'))
          .classed(className, true);

        fn({
          options: options || {},

          enter: function() {
            return nodesEnter;
          },

          update: function() {
            return nodes;
          },

          child: function(selector, fn) {
            var components = selector.split('.');
            var tagName = components[0];
            var className = components[1];

            var enteredChild = nodesEnter
              .append(tagName)
              .attr('class', className);

            var child = nodes.select(selector);

            fn({
              enter: function() {
                return enteredChild;
              },

              update: function() {
                return child;
              }
            });

            return child;
          }
        }, pageflow.sitemap);

        nodes.exit()
          .remove();
      };
    };
  }
};