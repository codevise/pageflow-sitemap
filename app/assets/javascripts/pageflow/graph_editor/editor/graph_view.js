/*global d3, console, Group, options, graphEditor, linkPathView, followPathView, placeholdersView, successorPathView, Page, PageCollection, confirm, withSession, var*/

graphEditor.GraphView = function(svgElement, graph) {
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
  graphEditor.pan = new graphEditor.PanHandler(svgElement, svgGroup);

  var ix = 0;

  function page(name, d) {
    return new Page({ x0: d.x, y0: d.y, name: name + ix++ });
  }

  var update =  function () {
    var grid = new graphEditor.Grid(graph);

    var phalf = window.options.page.height / 2;
    // add svg elements for different types of things
    graphEditor.groupView(svgPages, '.group', grid.groups, {
      droppedOnPlaceholder: function (source, target) {
        graph.moveGroupTo(target.lane, target.row, source.group);
      },
      droppedOnArea: function(source, target) {
        if(target.position == 'before') {
          graph.insertIntoGroupBefore(source.group, target.target);
        }
        else {
          graph.insertIntoGroupAfter(source.group, target.target);
        }
      },
      subViews: [
        { view: graphEditor.pagesView,
          selector: '.node',
          data: function(d) { return d.nodes; },
          options: {
            subViews: [
            {
              view: graphEditor.dropAreaView,
              selector: '.area',
              data: function(d) {
                return [
                  { dy: -(phalf+20), id: 2, target: d.page, position: 'before' },
                  { dy: phalf, id: 1, target: d.page, position: 'after' }
                ];
              }
            },
            {
              view: graphEditor.pageView,
              selector: '.page',
              data: function(d) { return [d]; },
              options: {
                droppedOnArea: function(source, target) {
                  if(target.position == 'before') {
                    graph.movePageBefore(source.page, target.target);
                  }
                  else {
                    graph.movePageAfter(source.page, target.target);
                  }
                },
                droppedOnPlaceholder: function (source, target) {
                  if (source.page.group().count() <= 1) {
                    graph.moveGroupTo(target.lane, target.row, source.page.group());
                  }
                  else {
                    graph.moveToEmptyGroup(target.lane, target.row, source.page);
                  }
                }
              }
            },
            {
              view: graphEditor.pageMenuView,
              selector: '.page-menu',
              data: function(d) { return [d]; },
              options: {
                subViews: [
                  {
                    view: graphEditor.removeButtonView,
                    selector: '.remove-button',
                    data: function(d) {
                      return [{
                        id: 'remove-button:' + d.id,
                        page: d.page,
                        pid: d.id
                      }];
                    },
                    options: {
                      clicked: function (source) {
                        source.page.remove();
                      }
                    }
                  },
                  {
                    view: graphEditor.addAfterButtonView,
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
                        source.page.group().addPageAfter(page('after', source.data), source.page);
                      }
                    }
                  },
                  {
                    view: graphEditor.knobView,
                    selector: '.knob',
                    data: function(d) { return d.availKnobs || []; },
                    options: {
                      droppedOnPage: function (source, target) {
                        if (!source.knob.linkTo(target.page)) {
                          alert('Konnte nicht verlinkt werden!\nDas Limit von ' + source.knob.get('limit') + ' ist ausgeschöpft.');
                        }
                      }
                    }
                  },
                  {
                    view: graphEditor.successorKnobView,
                    selector: '.successor-knob',
                    data: function(d) { return d.successor ? [d.successor] : []; },
                    options: {
                      droppedOnPage: function (source, target) {
                        source.group.makePredecessorOf(target.page);
                        if (target.group.get('pages').first() === target.page) {
                          source.group.joinWithIfConnected(target.group);
                        }
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
        if (confirm("Wollen Sie den Link wirklich löschen?")) {
          d.link.remove();
        }
      }
    });
    followPathView(svgLinks, '.follow', grid.followLinks, {
      clicked: function (d) {
        if (confirm("Wollen Sie den Link wirklich löschen?")) {
          d.source.page.removeSuccessorLink();
        }
      }
    });
    successorPathView(svgLinks, '.successor', grid.successorLinks, {
      clicked: function (d) {
        if (confirm("Wollen Sie den Link wirklich löschen?")) {
          d.source.page.removeSuccessorLink();
        }
      }
    });

    placeholdersView(svgPlaceholders, '.placeholder', grid.placeholders, {
      clicked: function(d) {
        var group = new Group({ pages: new PageCollection(page("X", d)) });

        d.lane.addGroup(group, d.row);
      }
    });

    grid.nodes.forEach(function(node) {
      node.page.x0 = node.x;
      node.page.y0 = node.y;
    });
  };

  update();
  var updateTimeout;
  graph.on('change', function () {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(update, 100);
  });
};
