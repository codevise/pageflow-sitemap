describe('Lane', function() {
  describe('#addGroup', function () {
    it('it adds a group to first place if another is a second', function () {
      var page = build.page(),
        group = build.group([]),
        anotherGroup = build.group([page], {row: 2}),
        lane = build.lane(anotherGroup);

      lane.addGroup(group, 0);

      expect(lane.at(0)).to.equal(group);
      expect(group.row()).to.equal(0);
    });
  });

  describe('#forEachWithPosition', function () {
    it('passes index and start and end to the callback', function () {
      var page = build.page(),
        group = build.group([page], {row: 2}),
        lane = build.lane(group);

      lane.forEachWithPosition(function (given, position) {
        expect(given).to.equal(group);
        expect(position.start).to.equal(2);
        expect(position.end).to.equal(3);
        expect(position.index).to.equal(0);
      });
    });

    it('uses the lane as context if non is given', function () {
      var page = build.page(),
      group = build.group([page]),
      lane = build.lane(group);

      lane.forEachWithPosition(function (given, position) {
        expect(this).to.equal(lane);
      });
    });

    it('uses the given context', function () {
      var page = build.page(),
        group = build.group([page]),
        lane = build.lane(group),
        context = {};

      lane.forEachWithPosition(function (given, position) {
        expect(this).to.be.equal(context);
      }, context);
    });
  });
});
