/*global Backbone, _, Group, PageCollection, Lane, Knob, Page, pageflow*/
/*exported Graph*/

var Graph = Backbone.Model.extend({

  initialize: function () {
    this.get('lanes').forEach(this.forwardEventsOfLane, this);
    this.enforceInternalState();
  },

  lane: function (i) {
    return this.get('lanes')[i];
  },

  group: function (laneIndex, groupIndex) {
    return this.lane(laneIndex).at(groupIndex);
  },

  eachGroup: function (callback) {
    _(this.get('lanes')).each(function (lane) {
      lane.each(function (group) {
        callback(group);
      });
    });
  },

  movePageBefore: function(movedPage, targetPage) {
    var targetGroup = targetPage.group();
    var sourceGroup = movedPage.group();

    sourceGroup.removePage(movedPage);
    targetGroup.addPageBefore(movedPage, targetPage);

    this.enforceInternalState();
  },

  movePageAfter: function(movedPage, targetPage) {
    var targetGroup = targetPage.group();
    var sourceGroup = movedPage.group();

    sourceGroup.removePage(movedPage);
    targetGroup.addPageAfter(movedPage, targetPage);

    this.enforceInternalState();
  },

  insertIntoGroupBefore: function (movedGroup, targetPage) {
    if (movedGroup !== targetPage.group()) {
      targetPage.group().addPagesBefore(movedGroup.get('pages'), targetPage);
      movedGroup.removeFromLane();

      this.enforceInternalState();
    }
  },

  insertIntoGroupAfter: function (movedGroup, targetPage) {
    if (movedGroup !== targetPage.group()) {
      targetPage.group().addPagesAfter(movedGroup.get('pages'), targetPage);
      movedGroup.removeFromLane();

      this.enforceInternalState();
    }
  },

  moveToEmptyGroup: function(lane, rowIndex, page) {
    this.enforceInternalState();

    var predecessorInGroup = page.predecessorInGroup();
    if (predecessorInGroup && page.successor()) {
      predecessorInGroup.makePredecessorOf(page.successor());
    }
    else {
      page.resetPredecessors();
    }
    page.resetSuccessor();

    var newGroup = Group.createGroup(lane.index(), rowIndex);
    newGroup.pushPage(page);

    this.moveGroupTo(lane, rowIndex, newGroup);
  },

  moveGroupTo: function (lane, rowIndex, toMove) {
    // this removes the group from every lane, why?
    this.get('lanes').forEach(function removeEachGroup(lane) {
      lane.removeGroup(toMove);
    });

    lane.addGroup(toMove, rowIndex);

    this.enforceInternalState();
  },

  triggerChange: function () {
    this.trigger('change');
  },

  enforceInternalState: function () {
    this.removeEmptyGroups();
    this.ensureEmptyLane();
    this.addGraphToLanes();
  },

  removeEmptyGroups: function() {
    this.get('lanes').forEach(function removeEachEmptyGroup(groups) {
      groups.removeEmptyGroups();
    });
  },

  ensureEmptyLane: function () {
    var lanes = this.get('lanes');
    if (lanes.length == 0 || !_.last(lanes).isEmpty()) {
      this.addLane(new Lane([]));
    }
  },

  addLane: function (lane) {
    lane.graph = this;
    this.forwardEventsOfLane(lane);
    this.get('lanes').push(lane);
  },

  addGraphToLanes: function() {
    this.get('lanes').forEach(function(lane) {
      lane.graph = this;
    }, this);
  },

  forwardEventsOfLane: function (lane) {
    lane.on('all', _.bind(this.trigger, this, 'change'));
  }

});

Graph.create = function () {
  var graph = {}, lanes = [] ;

  graph.lane = function () {
    var lane = {
      groups: [],
      group: function (chapter) {
        var group = {
          chapter: chapter,
          pages: [],
          page: function (page) {
            var page = {
              model: page,
              knobs: [],
              knob: function (name, pageLinks) {
                var knob = {
                  name: name,
                  pageLinks: pageLinks,
                  end: function () {
                    return page;
                  }
                };
                this.knobs.push(knob);
                return knob;
              },
              end: function () {
                return group;
              }
            };
            this.pages.push(page);
            return page;
          },
          row: function (i) {
            this.rowIndex = i;
            return this;
          },
          successor: function (name) {
            this.successorName = name;
            return this;
          },
          end: function () {
            return lane;
          }
        };

        this.groups.push(group);

        return group;
      },
      end: function () {
        return graph;
      }
    };

    lanes.push(lane);

    return lane;
  };

  graph.end = function () {
    var pagesMap = {}, groups = [];
    var laneModels = lanes.map(function (lane, laneIndex) {
      var groupModels = lane.groups.map(function (group) {
        var pageModels = group.pages.map(function (page) {
          var pageModel = new Page({
            page: page.model,
            title: page.model.configuration.get('title') || "Kein Titel"
          });

          // attach ref to sitemap model to pageflow model.
          page.model.sitemapPage = pageModel;

          pagesMap[page.model.id] = {
            data: page,
            model: pageModel
          };

          return pageModel;
        });

        var groupModel = new Group({
          chapter: group.chapter,
          pages: new PageCollection(pageModels)
        });

        // attach ref to sitemap model to pageflow model.
        group.chapter.sitemapGroup = groupModel;

        groupModel.lane(laneIndex);
        groupModel.row(group.rowIndex);

        groups.push({
          data: group,
          model: groupModel
        });

        return groupModel;
      });
      return new Lane(groupModels);
    });

    _.forEach(pagesMap, function (source) {
      // find scroll successor
      var successorPermaId = source.model.page().configuration.get('scroll_successor_id');
      var pageflowPage = pageflow.pages.getByPermaId(successorPermaId);
      if (pageflowPage) {
        source.model.set('successor', pageflowPage.sitemapPage);
      }

      // do knobs
      source.data.knobs.forEach(function (knobData) {
        var knob = new Knob({name: knobData.name, limit: knobData.limitValue }, {pageLinks: knobData.pageLinks});
        source.model.get('knobs').add(knob);
      });
    });

    groups.forEach(function (source) {
      if (source.data.successorName) {
        source.model.makePredecessorOf(pagesMap[source.data.successorName].model);
      }
    });

    return new Graph({ lanes: laneModels });
  };

  return graph;
};