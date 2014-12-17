/*global Backbone, Group, _*/
/*exported Lane*/

var Lane = Backbone.Collection.extend({
  model: Group,

  initialize: function(options) {
    this.graph = options.graph;
  },

  index: function() {
    return this.graph.get('lanes').indexOf(this);
  },

  addGroup: function (group, index) {
    var position = this.computeGroupInsertPosition(index);

    group.row(position.row);
    group.lane(this.index());

    if (position.index >= 0) {
      this.add(group, {at: position.index});
    }
    else {
      this.add(group);
    }
  },

  removeEmptyGroups: function() {
    var toRemove = [];
    this.forEach(function(group) {
      if (group.isEmpty()) {
        toRemove.push(group);
      }
    });
    _.forEach(toRemove, function(group) {
      this.removeGroup(group);
    }, this);
  },

  removeGroup: function(group) {
    console.log('removing group', group);
    group.get('chapter').destroy();
    this.remove(group);
  },

  forEachWithPosition: function (fn, c) {
    var currentRow = 0, groupIndex, group, row, end;

    var context = c ? c : this;

    for (groupIndex = 0; groupIndex < this.length; groupIndex++) {
      group = this.at(groupIndex);
      row = group.row();
      currentRow = row ? Math.max(row, currentRow) : currentRow;

      end = currentRow + group.count();
      fn.call(context, group, {
        index: groupIndex,
        start: currentRow,
        end: end
      });

      currentRow = end;
    }

    return this;
  },

  computeGroupInsertPosition: function (rowIndex) {
    var positions = [];
    this.forEachWithPosition(function (group, position) {
      positions.push(position);
    });

    var insertPosition = _.find(positions, function (position) {
      return position.start >= rowIndex;
    });

    if (insertPosition) {
      return {
        index: insertPosition.index,
        row: Math.min(insertPosition.start, rowIndex)
      };
    }
    else {
      return {
        index: this.length,
        row: rowIndex
      };
    }
  }
});
