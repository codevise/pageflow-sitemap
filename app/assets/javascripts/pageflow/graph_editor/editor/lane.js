/*global Backbone, Group*/
/*exported Lane*/

var Lane = Backbone.Collection.extend({
  model: Group,

  addGroup: function (group, index) {
    var position = this.computeGroupInsertPosition(index);

    // refactor me
    group.set('row', position.row);
    group.get('chapter').configuration.set('row', position.row);

    if (position.index >= 0) {
      this.add(group, {at: position.index});
    }
    else {
      this.add(group);
    }
  },

  forEachWithPosition: function (fn, c) {
    var currentRow = 0, groupIndex, group, row, end;

    var context = c ? c : this;

    for (groupIndex = 0; groupIndex < this.length; groupIndex++) {
      group = this.at(groupIndex);
      row = group.get('row');
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
