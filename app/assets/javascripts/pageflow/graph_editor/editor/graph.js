/*global Backbone, _, Group, PageCollection, Lane, Knob*/
/*exported Graph*/

var Graph = Backbone.Model.extend({

  initialize: function () {
    this.get('lanes').forEach(this.forwardEventsOfLane, this);
    this.enforceInternalState();
    this.on('change', this.enforceInternalState, this);
  },

  lane: function (i) {
    return this.get('lanes')[i];
  },

  group: function (laneIndex, groupIndex) {
    return this.lane(laneIndex).at(groupIndex);
  },

  movePageBefore: function(movedPage, targetPage) {
    var targetGroup = targetPage.group();
    var sourceGroup = movedPage.group();

    sourceGroup.removePage(movedPage);
    targetGroup.addPageBefore(movedPage, targetPage);

    this.triggerChange();
  },

  movePageAfter: function(movedPage, targetPage) {
    var targetGroup = targetPage.group();
    var sourceGroup = movedPage.group();

    sourceGroup.removePage(movedPage);
    targetGroup.addPageAfter(movedPage, targetPage);

    this.triggerChange();
  },

  insertIntoGroupBefore: function (movedGroup, targetPage) {
    if (movedGroup !== targetPage.group()) {
      targetPage.group().addPagesBefore(movedGroup.get('pages'), targetPage);
      movedGroup.removeFromLane();

      this.triggerChange();
    }
  },

  insertIntoGroupAfter: function (movedGroup, targetPage) {
    if (movedGroup !== targetPage.group()) {
      targetPage.group().addPagesAfter(movedGroup.get('pages'), targetPage);
      movedGroup.removeFromLane();

      this.triggerChange();
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

    page.removeFromGroup();

    var newGroup = new Group({ row: rowIndex, pages: new PageCollection([page]) });

    this.moveGroupTo(lane, rowIndex, newGroup);
  },

  moveGroupTo: function (lane, rowIndex, toMove) {
    this.get('lanes').forEach(function (lane) {
      lane.remove(toMove);
    });

    lane.addGroup(toMove, rowIndex);

    this.triggerChange();
  },

  triggerChange: function () {
    this.trigger('change');
  },

  enforceInternalState: function () {
    this.removeEmptyGroups();
    this.ensureEmptyLane();
  },

  removeEmptyGroups: function() {
    this.get('lanes').forEach(function(groups) {
      var toRemove = [];
      groups.forEach(function(group) {
        if (group.isEmpty()) {
          toRemove.push(group);
        }
      });
      _.forEach(toRemove, function(group) {
        groups.remove(group);
      });
    });
  },

  ensureEmptyLane: function () {
    var lanes = this.get('lanes');
    if (!_.last(lanes).isEmpty()) {
      var lane = new Lane();
      this.forwardEventsOfLane(lane);
      lanes.push(lane);
    }
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
          page: function (name) {
            var page = {
              name: name,
              knobs: [],
              knob: function (name) {
                var knob = {
                  name: name,
                  links: [],
                  link: function (targetId) {
                    this.links.push(targetId);
                    return this;
                  },
                  limit: function (limit) {
                    this.limitValue = limit;
                    return this;
                  },
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
            name: page.name
          });

          pagesMap[page.name] = {
            data: page,
            model: pageModel
          };

          return pageModel;
        });
        var groupModel = new Group({
          chapter: group.chapter,
          row: group.rowIndex,
          pages: new PageCollection(pageModels)
        });

        group.chapter.configuration.set({ row: group.rowIndex, lane: laneIndex });

        groups.push({
          data: group,
          model: groupModel
        });

        return groupModel;
      });
      return new Lane(groupModels);
    });

    _.forEach(pagesMap, function (source, name) {
      source.data.knobs.forEach(function (knobData) {
        var knob = new Knob({name: knobData.name, limit: knobData.limitValue});
        source.model.get('knobs').add(knob);

        knobData.links.forEach(function (targetName) {
          var target = pagesMap[targetName];

          if (!target) { throw 'Unknown link target ' + targetName + ' for ' + name; }

          knob.linkTo(target.model);
        });
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
