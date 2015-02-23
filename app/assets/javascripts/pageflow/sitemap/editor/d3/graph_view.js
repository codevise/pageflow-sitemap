/*global d3, console, Group, options, sitemap, linkPathView, followPathView, placeholdersView, successorPathView, Page, PageCollection, confirm, withSession, pageflow*/

sitemap.GraphView = function(svgElement, controller, viewModelOptions) {
  var svg = d3.select(svgElement)
    .attr("width", "100%")
    .attr("height", "100%");

  var svgGroup = svg.select("g.all");

  var svgPages = svg.select("g.pages");
  var svgLinks = svg.select("g.links");

  var scrollAndZoom = sitemap.behavior.scrollAndZoom({
    margin: 50
  })
    .on('change.graphView', function(event) {
      svgGroup.attr('transform', 'translate(' + event.translate + ')scale(' + event.scale + ')');
    });

  svg
    .call(scrollAndZoom)
    .call(sitemap.behavior.selectionRect({
      container: 'g.all',
      targets: '.group',
      selected: function(chapters) {
        controller.chaptersSelected(_(chapters).pluck('chapter'));
      }
    }));

  this.resize = function() {
    scrollAndZoom.updateSize(parseInt(svg.style('width'), 10),
                             parseInt(svg.style('height'), 10));
  };

  d3.rebind(this, scrollAndZoom,
            'on',
            'getScale', 'setScale',
            'getScrollX', 'setScrollX',
            'getScrollY', 'setScrollY',
            'getScrollWindowProportionX',
            'getScrollWindowProportionY');

  var update = function (entry, selection, updateOptions) {
    var layout =
      pageflow.sitemap.layout.create(entry, selection, updateOptions);

    var viewModel =
      new pageflow.sitemap.ViewModel(entry, selection, layout, viewModelOptions || {});

    scrollAndZoom.updateConstraints(-(layout.size.x + layout.laneWidth / 2),
                                    -(layout.size.y + layout.rowHeight / 2),
                                    layout.laneWidth / 2,
                                    layout.rowHeight / 2);

    svgPages.call(sitemap.chapterView(viewModel.chapters, {
      mousedown: function(source) {
        controller.chapterSelected(source.chapter, d3.event);
      },
      drag: function(options) {
        update(entry, selection, {dragDelta: {x: options.dx, y: options.dy}});
      },
      dragend: function(options) {
        var layout = pageflow.sitemap.layout.create(entry, selection, {
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

        update(entry, selection);
      },
      subViews: [
        { view: sitemap.pagesView,
          selector: '.node',
          data: function(d) { return d.nodes; },

          options: {
            drag: function(options) {
              update(entry, selection, {dragDelta: {x: options.dx, y: options.dy}});
            },
            dragend: function(options) {
              var layout = pageflow.sitemap.layout.create(entry, selection, {
                dragDelta: {
                  x: options.dx,
                  y: options.dy
                }
              });

              controller.pagesMoved(layout.pagesGroupedByChapters);
              update(entry, selection);
            },

            subViews: [
            {
              view: sitemap.pageView,
              selector: '.pageview',
              data: function(d) { return [d]; },
              options: {
                click: function(source) {
                  controller.pageSelected(source.page, d3.event);
                }
              }
            },
            {
              view: sitemap.pageMenuView,
              selector: '.page-menu',
              data: function(d) { return [d]; },
              options: {
                subViews: [
                  {
                    view: sitemap.addAfterButtonView,
                    selector: '.add-after-button',
                    data: function(d) {
                      return [{
                        id: 'add-after-button:' + d.id,
                        page: d.page,
                        data: d,
                        pid: d.id
                      }];
                    },
                    options: {
                      clicked: function (source) {
                        controller.addPageAfter(source.page);
                      }
                    }
                  },
                  {
                    view: sitemap.knobView,
                    selector: '.knob',
                    data: function(d) { return d.availKnobs || []; },
                    options: {
                      droppedOnPage: function (source, target) {
                        controller.knobDroppedOnPage(source.knob, target.page);
                      }
                    }
                  },
                  {
                    view: sitemap.successorKnobView,
                    selector: '.successor-knob',
                    data: function(d) { return d.successor ? [d.successor] : []; },
                    options: {
                      clicked: function() {
                        // Handler for click on successor button
                      },
                      droppedOnPage: function (source, target) {
                        controller.successorKnobDroppedOnPage(source.group, target.page);
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
      ]
    }));

    svgLinks.call(pageflow.sitemap.pageLinksView(viewModel.links, {
      click: function (d) {
        controller.pageLinkSelected(d.link, d3.event);
      }
    }));

    followPathView(svgLinks, '.follow', viewModel.followLinks, {
      clicked: function (d) {
        controller.followPathSelected(d.source.page);
      }
    });
    successorPathView(svgLinks, '.successor', viewModel.successorLinks, {
      clicked: function (d) {
        controller.successorPathSelected(d.source.page);
      }
    });

    viewModel.nodes.forEach(function(node) {
      node.page.x0 = node.x;
      node.page.y0 = node.y;
    });
  };

  controller.addUpdateHandler(update);
};
