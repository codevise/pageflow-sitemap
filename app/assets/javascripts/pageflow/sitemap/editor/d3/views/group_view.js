pageflow.sitemap.groupView = {
  define: function(className, fn) {
    var s = pageflow.sitemap;

    return function(data, options) {
      options = options || {};

      return function(container) {
        var previousNodes = container
          .selectAll('.' + className);

        var previousData = {};

        if (previousNodes.length) {
          previousData = _(previousNodes.data()).reduce(function(result, data) {
            result[data.id] = withoutModels(data);
            return result;
          }, {});
        }

        var nodes = previousNodes
          .data(data, s.utils.fn.d('id'))
          .order();

        var nodesEnter = nodes
          .enter()
          .append('g');

        var nodesUpdate = nodes
          .filter(function(d) {
            var prev = previousData[d.id];

            return !prev || !_.isEqual(prev, withoutModels(d));
          });

        nodesEnter
          .attr('id', s.utils.fn.d('id'))
          .classed(className, true);

        fn.call({
          options: options || {},

          enter: function() {
            return nodesEnter;
          },

          update: function() {
            return nodesUpdate;
          },

          call: function(fn) {
            nodesUpdate.call(fn);
          },

          child: childFactory(nodesEnter, nodesUpdate, options)
        }, pageflow.sitemap);

        if (!window.dontRemove) {
          nodes.exit()
            .remove();
        }
      };
    };

    function childFactory(nodesEnter, nodesUpdate, options) {
      return function(selector, fn) {
        var components = selector.split('.');
        var tagName = components[0];
        var className = components[1];

        var enteredChild = nodesEnter
          .append(tagName)
          .attr('class', className);

        var child = nodesUpdate.select(selector);

        if (fn) {
          fn.call({
            options: options,

            enter: function() {
              return enteredChild;
            },

            update: function() {
              return child;
            },
          });
        }

        return child;
      };
    }

    function withoutModels(item) {
      return _(item).reduce(function(result, value, key) {
        if (!value || !value.cid) {
          result[key] = value;
        }
        return result;
      }, {});
    }
  }
};