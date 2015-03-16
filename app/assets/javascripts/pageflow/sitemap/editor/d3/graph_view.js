(function() {
  var s = pageflow.sitemap;

  s.GraphView = function(svgElement, controller, options) {
    options = options || {};

    var svg = d3.select(svgElement)
      .attr('width', '100%')
      .attr('height', '100%');

    var svgGroup = svg.select('g.all');
    var svgChapters = svg.select('g.chapters');
    var svgPages = svg.select('g.pages');
    var svgLinks = svg.select('g.links');

    var scrollAndZoom = s.behavior.scrollAndZoom({
      margin: 50,
      change: function(event) {
        svgGroup.attr('transform', 'translate(' + event.translate + ')scale(' + event.scale + ')');
      }
    });

    var selectionRect = s.behavior.selectionRect({
      container: 'g.all',
      targets: '.chapter',
      selected: function(chapters) {
        controller.chaptersSelected(_(chapters).pluck('chapter'));
      }
    });

    this.resize = function() {
      scrollAndZoom.updateSize(parseInt(svg.style('width'), 10),
                               parseInt(svg.style('height'), 10));
    };

    d3.rebind(this, scrollAndZoom,
              'on',
              'getViewport',
              'getScale', 'setScale',
              'getScrollX', 'setScrollX',
              'getScrollY', 'setScrollY',
              'getScrollWindowProportionX',
              'getScrollWindowProportionY');

    svg
      .call(scrollAndZoom)
      .call(selectionRect);

    controller.addUpdateHandler(update);

    function updateScrollAndZoom(session, layout) {
      var selection = session.selection;

      scrollAndZoom.updateConstraints({
        minX: -(layout.size.x + layout.laneWidth / 2),
        minY: -(layout.size.y + layout.rowHeight / 2),
        maxX: layout.laneWidth / 2,
        maxY: layout.rowHeight / 2,
      });

      var centerTarget = session.highlightedPage ||
        selection.get('pages')[0] ||
        selection.get('chapters')[0];

      scrollAndZoom.ensureViewport({
        centerAt: centerTarget && layout.position(centerTarget),
        defaultViewport: options.defaultViewport
      });
    }

    function update(session, layoutOptions) {
      var entry = session.entry;
      var selection = session.selection;

      var layout =
        s.layout.create(entry, selection, layoutOptions);

      var viewModel =
        new s.ViewModel(session, layout);

      updateScrollAndZoom(session, layout);

      svg
        .on('dblclick', function() {
          if (d3.event.target !== svg.node()) {
            return;
          }

          controller.addChapter(layout.laneAndRowFromPoint(scrollAndZoom.pointTo(d3.event)));
        });

      svgChapters.call(s.chaptersView(viewModel.chapters, {
        mousedown: function(source) {
          controller.chapterSelected(source.chapter, d3.event);
        },

        drag: function(options) {
          update(session, {dragDelta: {x: options.dx, y: options.dy}});
        },

        dragend: function(options) {
          var layout = s.layout.create(entry, selection, {
            dragDelta: {
              x: options.dx,
              y: options.dy
            }
          });

          controller.chaptersPositioned(_.map(selection.get('chapters'), function(chapter) {
            var coordinates = layout.laneAndRowFromPoint(layout.position(chapter));

            return {
              chapter: chapter,
              lane: coordinates.lane,
              row: coordinates.row
            };
          }));

          update(session);
        },

        addPageButtonClick: function(d) {
          controller.addPage(d.chapter);
        }
      }));

      svgPages.call(s.pagesView(viewModel.nodes, {
        mousedown: function(source) {
          controller.pageSelected(source.page, d3.event);
        },

        dblclick: function(source) {
          controller.pageDblClick(source.page, d3.event);
        },

        drag: function(options) {
          update(session, {dragDelta: {x: options.dx, y: options.dy}});
        },

        dragend: function(options) {
          if (Math.abs(options.dx) > 10 || Math.abs(options.dy) > 10) {
            var layout = s.layout.create(entry, selection, {
              dragDelta: {
                x: options.dx,
                y: options.dy
              }
            });

            controller.pagesMoved(layout.pagesGroupedByChapters,
                                  layout.laneAndRowFromPoint(scrollAndZoom.pointTo(d3.event.sourceEvent)));
          }

          update(session);
        },
      }));

      svgLinks.call(s.pageLinksView(viewModel.links, {
        click: function (d) {
          controller.pageLinkSelected(d.link, d3.event);
        },

        drag: function(options) {
          update(session, {dragPosition: options.position});
        },

        dragend: function(options) {
          var page = layout.pageFromPoint(options.position);

          if (page) {
            if (options.data.link.placeholder) {
              controller.pageLinkPlaceholderDroppedOnPage(options.data.links,
                                                          page);
            }
            else {
              controller.pageLinkDroppedOnPage(options.data.links,
                                               options.data.link,
                                               page);
            }
          }

          update(session);
        }
      }));

      svgLinks.call(s.followLinksView(viewModel.followLinks, {
        addPageButtonClick: function(d) {
          controller.insertPageAfter(d.page);
        }
      }));

      svgLinks.call(s.successorLinksView(viewModel.successorLinks, {
        click: function (d) {
          controller.successorLinkSelected(d.link, d3.event);
        },

        drag: function(options) {
          update(session, {dragPosition: options.position});
        },

        dragend: function(options) {
          var targetPage = layout.pageFromPoint(options.position);

          controller.successorLinkDroppedOnPage(options.data.page,
                                                targetPage);
          update(session);
        },

        addPageButtonClick: function(d) {
          controller.addPage(d.page.chapter);
        }
      }));

      viewModel.nodes.forEach(function(node) {
        node.page.x0 = node.x;
        node.page.y0 = node.y;
      });
    }
  };
}());