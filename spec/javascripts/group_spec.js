describe('Group', function() {

  describe('the pages property', function () {
    it('defaults to the empty collection', function () {
      expect(new Group().get('pages').isEmpty()).to.be.true;
    });

    it('sets the predecessor properties according to group order', function () {
      var first = new Page({name: 'A'}),
        second = new Page({name: 'B'});

      new Group({pages: new PageCollection([first, second])});

      expect(second).to.be.successorOf(first);
    });

    it('sets the successor properties according to group order', function () {
      var first = new Page({name: 'A'}),
        second = new Page({name: 'B'});

      new Group({pages: new PageCollection([first, second])});

      expect(first.get('successor')).to.be.equal(second);
    });
  });

  describe('#addPagesBefore', function () {
    it('adds the pages', function () {
      var page = build.page({name: 'A'}),
        group = build.group([page]),
        anotherPage = build.page({name: 'B'}),
        pages = new PageCollection(anotherPage);

      group.addPagesBefore(pages, page);

      expect(group.get('pages').length).to.be.equal(2);
      expect(group.get('pages').at(0)).to.be.equal(anotherPage);
    });
  });

  describe('#addPagesAfter', function () {
    it('adds the pages', function () {
      var page = build.page({name: 'A'}),
        group = build.group([page]),
        anotherPage = build.page({name: 'B'}),
        pages = new PageCollection(anotherPage);

      group.addPagesAfter(pages, page);

      expect(group.get('pages').length).to.be.equal(2);
      expect(group.get('pages').at(1)).to.be.equal(anotherPage);
    });

    it('updates the successor property of page before', function () {
      var page = build.page({name: 'A'}),
        group = build.group([page]),
        anotherPage = build.page({name: 'B'}),
        pages = new PageCollection(anotherPage);

      group.addPagesAfter(pages, page);

      expect(page.get('successor')).to.be.equal(anotherPage);
    });

    it('updates the predecessor property of inserted page', function () {
      var page = build.page({name: 'A'}),
        group = build.group([page]),
        anotherPage = build.page({name: 'B'}),
        pages = new PageCollection(anotherPage);

      group.addPagesAfter(pages, page);

      expect(anotherPage).to.be.successorOf(page);
    });

    it('updates the successor property of inserted page', function () {
      var first = build.page({name: 'A'}),
        second = build.page({name: 'B'}),
        group = build.group([first, second]),
        inserted = build.page({name: 'C'}),
        pages = new PageCollection(inserted);
      first.makePredecessorOf(second);

      group.addPagesAfter(pages, first);

      expect(inserted.get('successor')).to.be.equal(second);
    });

    it('updates the predecessor property of the moved page', function () {
      var first = build.page({name: 'A'}),
        second = build.page({name: 'B'}),
        group = build.group([first, second]),
        inserted = build.page({name: 'C'}),
        pages = new PageCollection(inserted);
      first.makePredecessorOf(second);

      group.addPagesAfter(pages, first);

      expect(second).to.be.successorOf(inserted);
    });

    it('removes the pages from the group', function () {
      var first = build.page({name: 'A'}),
        second = build.page({name: 'B'}),
        group = build.group([first, second]),
        inserted = build.page({name: 'C'}),
        anotherGroup = build.group([inserted]);
      first.makePredecessorOf(second);

      group.addPagesAfter(anotherGroup.get('pages'), first);

      expect(anotherGroup.get('pages').isEmpty()).to.be.true;
    });

    it('moves multiple pages', function () {
      var page = build.page({name: 'X'}),
        first = build.page({name: 'A'}),
        second = build.page({name: 'B'}),
        group = build.group([page]),
        inserted = new PageCollection([first, second]);
      first.makePredecessorOf(second);

      group.addPagesAfter(inserted, page);

      expect(group.get('pages').at(0)).to.be.equal(page);
      expect(group.get('pages').at(1)).to.be.equal(first);
      expect(group.get('pages').at(2)).to.be.equal(second);
    });
  });

  describe('#removeFromLane', function () {
    it('resets the lane property', function () {
      var page = new Page({name: 'A'}),
        group = build.group([page]),
        lane = new Lane(group);

      group.removeFromLane();

      expect(group.collection).to.be.equal(undefined);
    });
  });

  describe('#makePredecessorOf', function () {
    it('sets page as successor', function () {
      var page = new Page({name: 'A'}),
        group = build.group([page]),
        successor = new Page({name: 'B'});

      group.makePredecessorOf(successor);

      expect(group.successor()).to.be.equal(successor);
    });

    it('sets the successor property on last page of group', function () {
      var page = new Page({name: 'A'}),
        group = build.group([page]),
        successor = new Page({name: 'B'});

      group.makePredecessorOf(successor);

      expect(page.get('successor')).to.be.equal(successor);
    });
  });

  describe('#joinIfConnected', function () {
    it('joins two groups if successor of first group is first page in second group', function () {
      var first = build.page(),
        second = build.page(),
        firstGroup = build.group([first]),
        secondGroup = build.group([second])
        lane = build.lane(firstGroup, secondGroup);
      first.makePredecessorOf(second);

      firstGroup.joinWithIfConnected(secondGroup);

      expect(lane.length).to.be.equal(1);
      expect(firstGroup.page(0)).to.be.equal(first);
      expect(firstGroup.page(1)).to.be.equal(second);
    });

    it('doesnot join two groups if first page of second is not successor of first', function () {
      var firstGroup = build.group([build.page()]),
        secondGroup = build.group([build.page()])
        lane = build.lane(firstGroup, secondGroup);

      firstGroup.joinWithIfConnected(secondGroup);

      expect(lane.length).to.be.equal(2);
    });

    it('doesnot join two groups if not located next to each other', function () {
      var first = build.page(),
        second = build.page(),
        firstGroup = build.group([first]),
        secondGroup = build.group([second], {row: 4}),
        lane = build.lane(firstGroup, secondGroup);
      first.makePredecessorOf(second);

      firstGroup.joinWithIfConnected(secondGroup);

      expect(lane.length).to.be.equal(2);
    });

    it('doesnot join two groups if not located in the same lane', function () {
      var first = build.page(),
        second = build.page(),
        firstGroup = build.group([first]),
        secondGroup = build.group([second], {row: 4}),
        firstLane = build.lane(firstGroup),
        secondLane = build.lane(secondGroup);
      first.makePredecessorOf(second);

      firstGroup.joinWithIfConnected(secondGroup);

      expect(firstLane.length).to.be.equal(1);
      expect(secondLane.length).to.be.equal(1);
    });
  });

  describe('#succesor', function () {
    it('returns undefined if group is empty', function () {
      var group = new Group({pages: new PageCollection()});

      expect(group.successor()).to.be.equal(undefined);
    });
  });

});
