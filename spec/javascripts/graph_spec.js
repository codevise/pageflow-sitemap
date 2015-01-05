describe('Graph', function() {
  var graph;

  describe('the change event', function () {
    var handler;

    beforeEach(function () {
      handler = sinon.spy();

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

    xit('triggers a change when moving a page after another', function () {
      var moved = page(1, 0, 0),
        target = page(0, 0, 0);

      graph.movePageAfter(moved, target);

      expect(handler.called).to.be.true;
    });

    xit('triggers a change when moving a page before another', function () {
      var moved = page(1, 0, 0),
        target = page(0, 0, 0);

      graph.movePageBefore(moved, target);

      expect(handler.called).to.be.true;
    });

    xit('triggers a change when moving to an empty group', function () {
      var moved = page(1, 0, 0),
        lane = graph.lane(0);

      graph.moveToEmptyGroup(lane, 2, moved);

      expect(handler.called).to.be.true;
    });

    xit('triggers a change when adding a link', function () {
      var source = new Knob(),
        p = new Page({knobs: new KnobCollection([source])}),
        target = page(0, 0, 0);

      source.linkTo(target);

      expect(handler.called).to.be.true;
    });
  });

  describe('#moveToEmptyGroup', function () {
    xit('adds a group to the empty graph', function () {
      var lane = new Lane(),
        page = new Page();
      graph = new Graph({lanes: [lane]});

      graph.moveToEmptyGroup(lane, 0, page);

      expect(graph.lane(0).length).to.be.equal(1);
    });

    xit('resets the predecessor and successor', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page(),
        group = new Group({pages: new PageCollection([first, second, third])}),
        lane = new Lane([group]),
        graph = new Graph({lanes: [lane]});

      graph.moveToEmptyGroup(lane, 4, second);

      expect(second.successor()).not.to.be.true;
      expect(second.get('predecessors')).to.be.empty();
    });

    xit('connects the predecessor in group and successor', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page(),
        group = new Group({pages: new PageCollection([first, second, third])}),
        lane = new Lane([group]),
        graph = new Graph({lanes: [lane]});

      graph.moveToEmptyGroup(lane, 4, second);

      expect(third).to.be.successorOf(first);
    });

    xit('doesnot connects the predecessor and successor if not in same group', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page(),
        group = new Group({pages: new PageCollection([second, third])}),
        lane = new Lane([group]),
        graph = new Graph({lanes: [lane]});
      first.makePredecessorOf(second);

      graph.moveToEmptyGroup(lane, 4, second);

      expect(first.successor()).to.be.undefined();
      expect(third.get('predecessors')).to.be.empty();
    });

  });

  describe('#moveGroupTo', function () {
    xit('adds a group to the empty graph', function () {
       var lane = new Lane(),
        page = new Page(),
        group = new Group({pages: new PageCollection(page)});
        graph = new Graph({lanes: [lane]});

      graph.moveGroupTo(lane, 0, group);

      expect(graph.lane(0).length).to.be.equal(1);
    });

    xit('removes the group from lane', function () {
      var firstLane = new Lane(),
        secondLane = new Lane(),
        page = new Page(),
        group = new Group({pages: new PageCollection(page)});
      firstLane.add(group);
      graph = new Graph({lanes: [firstLane, secondLane]});

      graph.moveGroupTo(secondLane, 0, group);

      expect(graph.lane(0).length).to.be.equal(0);
    });

    xit('to the row property insert position', function() {
      var lane = new Lane(),
        page = new Page(),
        group = new Group({pages: new PageCollection(page), row: 1 });
        graph = new Graph({lanes: [lane]});

      graph.moveGroupTo(lane, 2, group);

      expect(group.row()).to.be.equal(2);
    });
  });

  describe('#insertIntoGroupBefore', function () {
    xit('inserts after', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupBefore(anotherGroup, page);

      expect(group.get('pages').length).to.be.equal(2);
      expect(group.get('pages').at(1).get('name')).to.be.equal('A');
    });

    xit('removes the insert group from lane', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupBefore(anotherGroup, page);

      expect(lane.length).to.be.equal(1);
    });

    xit('doesnot change the lane if group is inserted into group', function () {
      var page = new Page({name: 'A'}),
        anotherPage = new Page({name: 'B'}),
        group = new Group({pages: new PageCollection(page, anotherPage), row: 1 }),
        lane = new Lane(group),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupBefore(group, page);

      expect(lane.length).to.be.equal(1);
    });
  });

  describe('#insertIntoGroupAfter', function () {
    xit('inserts after', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupAfter(anotherGroup, page);

      expect(group.get('pages').length).to.be.equal(2);
      expect(group.get('pages').at(1).get('name')).to.be.equal('B');
    });

    xit('removes the insert group from lane', function () {
      var page = new Page({name: 'A'}),
        group = new Group({pages: new PageCollection(page), row: 1 }),
        anotherPage = new Page({name: 'B'}),
        anotherGroup = new Group({pages: new PageCollection(anotherPage), row: 3 });
        lane = new Lane(group, anotherGroup),
        graph = new Graph({lanes: [lane]});

      graph.insertIntoGroupAfter(anotherGroup, page);

      expect(lane.length).to.be.equal(1);
    });

    xit('doesnot change the lane if group is inserted into group', function () {
      var page = build.page({name: 'A'}),
        anotherPage = build.page({name: 'B'}),
        group = new Group([page, anotherPage], {row: 1}),
        lane = build.lane(group),
        graph = build.graph;

      graph.insertIntoGroupAfter(group, page);

      expect(lane.length).to.be.equal(1);
    });
  });

  xit('adds an empty lane to the right', function () {
    var lane = build.lane(),
      page = build.page();
      graph = build.graph;

    graph.moveToEmptyGroup(lane, 0, page);

    expect(graph.get('lanes').length).to.be.equal(2);
    expect(graph.lane(1).isEmpty()).to.be.true;
  });

  function page(i, j, k) {
    return graph.group(i, j).page(k);
  }

});
