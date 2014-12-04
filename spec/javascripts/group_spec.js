describe('Group', function() {

  describe('the pages property', function () {
    it('defaults to the empty collection', function () {
      expect(new Group().get('pages').isEmpty()).toBe(true);
    });

    it('sets the predecessor properties according to group order', function () {
      var first = new Page({name: 'A'}),
        second = new Page({name: 'B'});


      new Group({pages: new PageCollection([first, second])});

      expect(second).toBeSuccessorOf(first);
    });

    it('sets the successor properties according to group order', function () {
      var first = new Page({name: 'A'}),
        second = new Page({name: 'B'});

      new Group({pages: new PageCollection([first, second])});

      expect(first.get('successor')).toEqual(second);
    });
  });

  describe('#addPagesBefore', function () {
    it('adds the pages', function () {
      var page = new Page({name: 'A'}),
      group = new Group({pages: new PageCollection(page)}),
      anotherPage = new Page({name: 'B'}),
      pages = new PageCollection(anotherPage);

      group.addPagesBefore(pages, page);

      expect(group.get('pages').length).toEqual(2);
      expect(group.get('pages').at(0)).toEqual(anotherPage);
    });
  });

  describe('#addPagesAfter', function () {
    it('adds the pages', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page)}),
        anotherPage = new Page({name: 'B'}),
        pages = new PageCollection(anotherPage);

      group.addPagesAfter(pages, page);

      expect(group.get('pages').length).toEqual(2);
      expect(group.get('pages').at(1)).toEqual(anotherPage);
    });

    it('updates the successor property of page before', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page)}),
        anotherPage = new Page({name: 'B'}),
        pages = new PageCollection(anotherPage);

      group.addPagesAfter(pages, page);

      expect(page.get('successor')).toEqual(anotherPage);
    });

    it('updates the predecessor property of inserted page', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page)}),
        anotherPage = new Page({name: 'B'}),
        pages = new PageCollection(anotherPage);

      group.addPagesAfter(pages, page);

      expect(anotherPage).toBeSuccessorOf(page);
    });

    it('updates the successor property of inserted page', function () {
      var first = new Page({name: 'A'}),
        second = new Page({name: 'B'}),
        group = new Group({pages: new PageCollection([first, second])}),
        inserted = new Page({name: 'C'}),
        pages = new PageCollection(inserted);
      first.makePredecessorOf(second);

      group.addPagesAfter(pages, first);

      expect(inserted.get('successor')).toEqual(second);
    });

    it('updates the predecessor property of the moved page', function () {
      var first = new Page({name: 'A'}),
        second = new Page({name: 'B'}),
        group = new Group({pages: new PageCollection([first, second])}),
        inserted = new Page({name: 'C'}),
        pages = new PageCollection(inserted);
      first.makePredecessorOf(second);

      group.addPagesAfter(pages, first);

      expect(second).toBeSuccessorOf(inserted);
    });

    it('removes the pages from the group', function () {
      var first = new Page({name: 'A'}),
        second = new Page({name: 'B'}),
        group = new Group({pages: new PageCollection([first, second])}),
        inserted = new Page({name: 'C'}),
        pages = new PageCollection(inserted),
        anotherGroup = new Group({pages: pages});
      first.makePredecessorOf(second);

      group.addPagesAfter(pages, first);

      expect(anotherGroup.get('pages')).toBeEmpty();
    });

    it('moves multiple pages', function () {
      var page = new Page({name: 'X'}),
        first = new Page({name: 'A'}),
        second = new Page({name: 'B'}),
        group = new Group({pages: new PageCollection([page])}),
        inserted = new PageCollection([first, second]),
        anotherGroup = new Group({pages: inserted});
      first.makePredecessorOf(second);

      group.addPagesAfter(inserted, page);

      expect(group.get('pages').at(0)).toEqual(page);
      expect(group.get('pages').at(1)).toEqual(first);
      expect(group.get('pages').at(2)).toEqual(second);
    });
  });

  describe('#removeFromLane', function () {
    it('resets the lane property', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page)}),
        lane = new Lane(group);

      group.removeFromLane();

      expect(group.collection).toEqual(undefined);
    });
  });

  describe('#makePredecessorOf', function () {
    it('sets page as successor', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page)}),
        successor = new Page({name: 'B'});

      group.makePredecessorOf(successor);

      expect(group.successor()).toEqual(successor);
    });

    it('sets the successor property on last page of group', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page)}),
        successor = new Page({name: 'B'});

      group.makePredecessorOf(successor);

      expect(page.get('successor')).toEqual(successor);
    });
  });

  describe('#joinIfConnected', function () {
    it('joins two groups if successor of first group is first page in second group', function () {
      var graph = Graph.create()
        .lane()
          .group().page('A').end().end()
          .group().page('B').end().end()
          .end()
        .end(),
        first = graph.group(0, 0).page(0),
        second = graph.group(0, 1).page(0);
      first.makePredecessorOf(second);

      graph.group(0,0).joinWithIfConnected(graph.group(0,1));

      expect(graph.lane(0).length).toEqual(1);
      expect(graph.group(0, 0).page(0)).toEqual(first);
      expect(graph.group(0, 0).page(1)).toEqual(second);
    });

    it('doesnot join two groups if first page of second is not successor of first', function () {
      var graph = Graph.create()
        .lane()
          .group().page('A').end().end()
          .group().row(4).page('B').end().end()
          .end()
        .end(),
        first = graph.group(0, 0).page(0),
        second = graph.group(0, 1).page(0);

      graph.group(0,0).joinWithIfConnected(graph.group(0,1));

      expect(graph.lane(0).length).toEqual(2);
    });

    it('doesnot join two groups if not located next to each other', function () {
      var graph = Graph.create()
        .lane()
          .group().page('A').end().end()
          .group().row(4).page('B').end().end()
          .end()
        .end(),
        first = graph.group(0, 0).page(0),
        second = graph.group(0, 1).page(0);
      first.makePredecessorOf(second);

      graph.group(0,0).joinWithIfConnected(graph.group(0,1));

      expect(graph.lane(0).length).toEqual(2);
    });

    it('doesnot join two groups if not located in the same lane', function () {
      var graph = Graph.create()
        .lane()
          .group().page('A').end().end()
          .end()
        .lane()
          .group().row(1).page('B').end().end()
          .end()
        .end(),
        first = graph.group(0, 0).page(0),
        second = graph.group(1, 0).page(0);
      first.makePredecessorOf(second);

      graph.group(0,0).joinWithIfConnected(graph.group(1,0));

      expect(graph.lane(0).length).toEqual(1);
      expect(graph.lane(1).length).toEqual(1);
    });
  });

  describe('#succesor', function () {
    it('returns undefined if group is empty', function () {
      var group = new Group({pages: new PageCollection()});

      expect(group.successor()).toEqual(undefined);
    });
  });

});
