/*global s d3, graphEditor, _, d3, options*/

(function () {

  graphEditor.pageMenuItem = function (className) {
    var item = {};
    var svgElementType = 'svg:rect';
    var transform = function() { return "translate(0, 0)"; };

    item.transform = function (fn) {
      transform = fn;
      return item;
    };

    item.element = function (elementType) {
      svgElementType = elementType;
      return item;
    };

    item.enter = function (node, parentNode) {
      var group = node.append('svg:g');

      group.attr("transform", transform);

      var presentation = group.append(svgElementType)
          .attr("class", className + ' menu-item')
          .on('mouseover', function(d) {
            if (d.dontHide) return;

            parentNode.datum(function(x) {
              if (x.id === d.pid) {
                clearTimeout(x.page.menuTimeout);
                d3.select(this).classed('show-menu', true);
              }
              return x;
            });
          })
          .on('mouseout', function(d) {
            if (d.dontHide) return;

            parentNode.datum(function(x) {
              if (x.id === d.pid) {
                x.page.menuTimeout = setTimeout(_.bind(function () {
                  d3.select(this).classed('show-menu', false);
                }, this.parentNode), 500);
              }
              return x;
            });
          });

      return {
        presentation: function (fn) {
          fn.call(presentation);
          return this;
        },
        dummy: function (fn) {
          var dummy = group.append(svgElementType)
              .attr('class', className + '-dummy menu-item-dummy');
          fn.call(dummy);
          return this;
        },
        drag: function (fn) {
          var dragBuilder = drag(parentNode);
          fn.call(dragBuilder);
          presentation.call(dragBuilder.listener());
        }
      };
    };

    item.exit = function(node) {
      node.remove();
    };

    function drag (parentNode) {
      return graphEditor.addDrag(className + '-drag')
          .start(function (d) {
            parentNode.datum(function(x) {
              if (x.id === d.pid) {
                clearTimeout(x.page.menuTimeout);
                d3.select(this.parentNode).classed('show-menu', true);
              }
              return x;
            });
          })
          .end(function (d) {
            parentNode.datum(function(x) {
              if (x.id === d.pid) {
                clearTimeout(x.page.menuTimeout);
                d3.select(this.parentNode).classed('show-menu', false);
              }
              return x;
            });
          })
          .dummy(function () { return d3.select(this.parentNode).select('.menu-item-dummy'); });
    }

    return item;
  };

  var buttonView = function (name, transform) {
    return graphEditor.D3View(function (svg) {
      var removeItem = graphEditor.pageMenuItem(name)
        .transform(transform);

      svg.enter = function (node, opts, parentNode) {
        removeItem.enter(node, parentNode)
          .presentation(function () {
            this.attr('height', 20)
              .attr('width', 20)
              .on('click.removeHandler', function (d) {
                if (opts.clicked) {
                  opts.clicked.call(this, d);
                }
              });
          });
      };

      svg.exit = function (node) {
        removeItem.exit(node);
      };
    });
  };

  graphEditor.removeButtonView = buttonView('remove-button',
                                            function () {
                                              return "translate(" + -(options.page.width / 2 + 10) + ", " +
                                                -(options.page.height / 2 + 10) + ")";
                                            }
                                           );

  graphEditor.addAfterButtonView = buttonView('add-after-button',
                                            function () {
                                              return "translate(" + -(options.page.width / 2 + 10) + ", " +
                                                (options.page.height / 2 - 10) + ")";
                                            }
                                           );

  graphEditor.pageMenuView = graphEditor.D3View(function (svg) {
    svg.enter = function (node) {
      node.append('svg:g').attr('class', 'page-menu');
    };
  });
}());
