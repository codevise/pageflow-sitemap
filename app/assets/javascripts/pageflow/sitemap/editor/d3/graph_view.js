/*global d3, console, Group, options, sitemap, linkPathView, followPathView, placeholdersView, successorPathView, Page, PageCollection, confirm, withSession, pageflow*/

sitemap.GraphView = function(svgElement, controller, viewModelOptions) {
  var svg = d3.select(svgElement)
    .attr("width", "100%")
    .attr("height", "100%");

  var svgGroup = svg.select("g.all");

  var svgPages = svg.select("g.pages");
  var svgLinks = svg.select("g.links");
  var svgPlaceholders = svg.select("g.placeholders");
  // var svgControls = svg.select("g.controls");

  // this should go somewhere to be usable by D3Views
  //sitemap.pan = new sitemap.PanHandler(svgElement, svgGroup);

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
    var viewModel = new sitemap.ViewModel(entry, selection, _.extend(viewModelOptions || {}, updateOptions || {}));

    scrollAndZoom.updateConstraints(-(viewModel.size.x + window.options.page.width / 2),
                                    -(viewModel.size.y + window.options.page.height / 2),
                                    window.options.page.width / 2,
                                    window.options.page.height / 2);

    var phalf = window.options.page.height / 2;
    // add svg elements for different types of things

    svgPages.call(sitemap.chapterView(viewModel.chapters, {
      clicked: function(source) {
        controller.chapterSelected(source.chapter, d3.event);
      },
      mousedown: function(source) {
        if (!_.contains(selection.get('chapters'), source.chapter)) {
          selection.set('chapters', [source.chapter]);
        }
      },
      drag: function(options) {
        update(entry, selection, {dragDx: options.dx, dragDy: options.dy});
      },
      dragend: function(options) {
        var cellWidth = 2 * window.options.page.horizontalMargin + window.options.page.width;
        var cellHeight = 2 * window.options.page.verticalMargin + window.options.page.height;

        controller.chaptersPositioned(_.map(selection.get('chapters'), function(chapter) {
          return {
            chapter: chapter,
            row: chapter.configuration.get('row') + Math.round(options.dy / cellHeight),
            lane: chapter.configuration.get('lane') + Math.round(options.dx / cellWidth)
          };
        }));
      },
      droppedOnPlaceholder: function (source, target) {
        controller.groupDroppedOnPlaceholder(source.group, target);
      },
      droppedOnArea: function(source, target) {
        controller.groupDroppedOnArea(source.group, target.target, target.position);
      },
      subViews: [
        { view: sitemap.pagesView,
          selector: '.node',
          data: function(d) { return d.nodes; },



          options: {
            drag: function(options) {
              update(entry, selection, {dragDx: options.dx, dragDy: options.dy});
            },
            dragend: function(options) {},

            subViews: [
            {
              view: sitemap.pageView,
              selector: '.pageview',
              data: function(d) { return [d]; },
              options: {
                click: function(source) {
                  controller.pageSelected(source.page, d3.event);
                },
                droppedOnArea: function(source, target) {
                  controller.pageDroppedOnArea(source.page, target.target, target.position);
                },
                droppedOnPlaceholder: function (source, target) {
                  controller.pageDroppedOnPlaceholder(source.page, target);
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

    linkPathView(svgLinks, '.link', viewModel.links, {
      clicked: function (d) {
        controller.linkPathSelected(d.link);
      }
    });
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

    placeholdersView(svgPlaceholders, '.placeholder', viewModel.placeholders, {
      clicked: function(d) {
        controller.placeholderSelected(d);
      }
    });

    viewModel.nodes.forEach(function(node) {
      node.page.x0 = node.x;
      node.page.y0 = node.y;
    });
  };

  controller.addUpdateHandler(update);
};
