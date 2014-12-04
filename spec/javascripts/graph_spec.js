describe('Graph', function() {
  var graph;

  describe('the change event', function () {
    var handler;

    beforeEach(function () {
      handler = jasmine.createSpy('handler');

      graph = new Graph({
        lanes: [
          new Lane(
            Group.createGroup({ pages: [ {name: 'A1'} ] })
          ),
          new Lane(
            Group.createGroup({ row: 2, pages: [{name: 'C1'}]})
          )
        ]
      });

      graph.on('change', handler);
    });

    it('triggers a change when moving a page after another', function () {
      var moved = page(1, 0, 0),
        target = page(0, 0, 0);

      graph.movePageAfter(moved, target);

      expect(handler).toHaveBeenCalled();
    });

    it('triggers a change when moving a page before another', function () {
      var moved = page(1, 0, 0),
        target = page(0, 0, 0);

      graph.movePageBefore(moved, target);

      expect(handler).toHaveBeenCalled();
    });

    it('triggers a change when moving to an empty group', function () {
      var moved = page(1, 0, 0),
        lane = graph.lane(0);

      graph.moveToEmptyGroup(lane, 2, moved);

      expect(handler).toHaveBeenCalled();
    });

    it('triggers a change when adding a link', function () {
      var source = new Knob(),
        p = new Page({knobs: new KnobCollection([source])}),
        target = page(0, 0, 0);

      source.linkTo(target);

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('#moveToEmptyGroup', function () {
    it('adds a group to the empty graph', function () {
      var lane = new Lane(),
        page = new Page();
      graph = new Graph({lanes: [lane]});

      graph.moveToEmptyGroup(lane, 0, page);

      expect(graph.lane(0).length).toEqual(1);
    });

    it('resets the predecessor and successor', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page(),
        group = new Group({pages: new PageCollection([first, second, third])}),
        lane = new Lane([group]),
        graph = new Graph({lanes: [lane]});

      graph.moveToEmptyGroup(lane, 4, second);

      expect(second.successor()).toBeFalsy();
      expect(second.get('predecessors')).toBeEmpty();
    });

    it('connects the predecessor in group and successor', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page(),
        group = new Group({pages: new PageCollection([first, second, third])}),
        lane = new Lane([group]),
        graph = new Graph({lanes: [lane]});

      graph.moveToEmptyGroup(lane, 4, second);

      expect(third).toBeSuccessorOf(first);
    });

    it('doesnot connects the predecessor and successor if not in same group', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page(),
        group = new Group({pages: new PageCollection([second, third])}),
        lane = new Lane([group]),
        graph = new Graph({lanes: [lane]});
      first.makePredecessorOf(second);

      graph.moveToEmptyGroup(lane, 4, second);

      expect(first.successor()).toBeFalsy();
      expect(third.get('predecessors')).toBeEmpty();
    });

  });

  describe('#moveGroupTo', function () {
    it('adds a group to the empty graph', function () {
       var lane = new Lane(),
        page = new Page(),
        group = new Group({pages: new PageCollection(page)});
        graph = new Graph({lanes: [lane]});

      graph.moveGroupTo(lane, 0, group);

      expect(graph.lane(0).length).toEqual(1);
    });

    it('removes the group from lane', function () {
      var firstLane = new Lane(),
        secondLane = new Lane(),
        page = new Page(),
        group = new Group({pages: new PageCollection(page)});
      firstLane.add(group);
      graph = new Graph({lanes: [firstLane, secondLane]});

      graph.moveGroupTo(secondLane, 0, group);

      expect(graph.lane(0).length).toEqual(0);
    });

    it('to the row property insert position', function() {
      var lane = new Lane(),
        page = new Page(),
        group = new Group({pages: new PageCollection(page), row: 1 });
        graph = new Graph({lanes: [lane]});

      graph.moveGroupTo(lane, 2, group);

      expect(group.get('row')).toEqual(2);
    });
  });

  describe('#insertIntoGroupBefore', function () {
    it('inserts after', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupBefore(anotherGroup, page);

      expect(group.get('pages').length).toEqual(2);
      expect(group.get('pages').at(1).get('name')).toEqual('A');
    });

    it('removes the insert group from lane', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupBefore(anotherGroup, page);

      expect(lane.length).toEqual(1);
    });

    it('doesnot change the lane if group is inserted into group', function () {
      var page = new Page({name: 'A'}),
        anotherPage = new Page({name: 'B'}),
        group = new Group({pages: new PageCollection(page, anotherPage), row: 1 }),
        lane = new Lane(group),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupBefore(group, page);

      expect(lane.length).toEqual(1);
    });
  });

  describe('#insertIntoGroupAfter', function () {
    it('inserts after', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupAfter(anotherGroup, page);

      expect(group.get('pages').length).toEqual(2);
      expect(group.get('pages').at(1).get('name')).toEqual('B');
    });

    it('removes the insert group from lane', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupAfter(anotherGroup, page);

      expect(lane.length).toEqual(1);
    });

    it('doesnot change the lane if group is inserted into group', function () {
      var page = new Page({name: 'A'}),
        anotherPage = new Page({name: 'B'}),
        group = new Group({pages: new PageCollection(page, anotherPage), row: 1 }),
        lane = new Lane(group),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupAfter(group, page);

      expect(lane.length).toEqual(1);
    });
  });

  it('adds an empty lane to the right', function () {
    var lane = new Lane(),
      page = new Page();
      graph = new Graph({lanes: [lane]});

    graph.moveToEmptyGroup(lane, 0, page);

    expect(graph.get('lanes').length).toEqual(2);
    expect(graph.lane(1).isEmpty()).toBe(true);
  });

  function page(i, j, k) {
    return graph.group(i, j).page(k);
  }

});
