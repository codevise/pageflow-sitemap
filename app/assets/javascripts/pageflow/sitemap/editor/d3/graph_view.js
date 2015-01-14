/*global d3, console, Group, options, sitemap, linkPathView, followPathView, placeholdersView, successorPathView, Page, PageCollection, confirm, withSession, pageflow*/

sitemap.GraphView = function(svgElement, controller) {
  var svg = d3.select(svgElement)
    .attr("width", "100%")
    .attr("height", "100%");

  var svgGroup = svg.select("g.all")
    .attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

  var svgPages = svg.select("g.pages");
  var svgLinks = svg.select("g.links");
  var svgPlaceholders = svg.select("g.placeholders");
  // var svgControls = svg.select("g.controls");

  // this should go somewhere to be usable by D3Views
  sitemap.pan = new sitemap.PanHandler(svgElement, svgGroup);

  var update =  function (graph) {
    var grid = new sitemap.Grid(graph);

    var phalf = window.options.page.height / 2;
    // add svg elements for different types of things
    sitemap.groupView(svgPages, '.group', grid.groups, {
      clicked: function(source) {
        controller.groupSelected(source.group);
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
            subViews: [
            {
              view: sitemap.dropAreaView,
              selector: '.area',
              data: function(d) {
                return [
                  { dy: -(phalf+20), id: 2, target: d.page, position: 'before' },
                  { dy: phalf, id: 1, target: d.page, position: 'after' }
                ];
              }
            },
            {
              view: sitemap.pageView,
              selector: '.pageview',
              data: function(d) { return [d]; },
              options: {
                click: function(source) {
                  controller.pageSelected(source.page);
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
    });

    linkPathView(svgLinks, '.link', grid.links, {
      clicked: function (d) {
        controller.linkPathSelected(d.link);
      }
    });
    followPathView(svgLinks, '.follow', grid.followLinks, {
      clicked: function (d) {
        controller.followPathSelected(d.source.page);
      }
    });
    successorPathView(svgLinks, '.successor', grid.successorLinks, {
      clicked: function (d) {
        controller.successorPathSelected(d.source.page);
      }
    });

    placeholdersView(svgPlaceholders, '.placeholder', grid.placeholders, {
      clicked: function(d) {
        controller.placeholderSelected(d);
      }
    });

    grid.nodes.forEach(function(node) {
      node.page.x0 = node.x;
      node.page.y0 = node.y;
    });
  };

    controller.addUpdateHandler(update);
};
