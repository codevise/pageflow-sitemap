describe('Lane', function() {
  describe('#addGroup', function () {
    it('it adds a group to first place if another is a second', function () {
      var page = new Page(),
        group = new Group(),
        anotherGroup = new Group({row: 2, pages: new PageCollection(page)}),
        lane = new Lane(anotherGroup);

      lane.addGroup(group, 0);

      expect(lane.at(0)).toEqual(group);
      expect(group.get('row')).toEqual(0);
    });
  });

  describe('#forEachWithPosition', function () {
    it('passes index and start and end to the callback', function () {
      var page = new Page(),
        group = new Group({row: 2, pages: new PageCollection(page)}),
        lane = new Lane(group);

      lane.forEachWithPosition(function (given, position) {
        expect(given).toEqual(group);
        expect(position.start).toEqual(2);
        expect(position.end).toEqual(3);
        expect(position.index).toEqual(0);
      });
    });

    it('uses the lane as context if non is given', function () {
      var page = new Page(),
      group = new Group({pages: new PageCollection(page)}),
      lane = new Lane(group);

      lane.forEachWithPosition(function (given, position) {
        expect(this).toEqual(lane);
      });
    });

    it('uses the given context', function () {
      var page = new Page(),
        group = new Group({pages: new PageCollection(page)}),
        lane = new Lane(group),
        context = {};

      lane.forEachWithPosition(function (given, position) {
        expect(this).toEqual(context);
      }, context);
    });
  });
});
