describe('Page', function() {
  describe('the incommingLinks property', function () {
    it('defaults to the empty collection', function () {
      expect(new Page().get('incommingLinks').isEmpty()).toBe(true);
    });

    it('triggers a change event if contained pages get linked', function () {
      var source = new Knob(),
        sourcePage = new Page({knobs: new KnobCollection([source])}),
        target = new Page(),
        listener = jasmine.createSpy('listener');
      target.on('change', listener);

      source.linkTo(target);

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('the predecessors property', function () {
    it('defaults to the empty collection', function () {
      expect(new Page().get('predecessors').isEmpty()).toBe(true);
    });
  });

  describe('#remove', function () {
    it('removes the page from the group', function () {
      var page = new Page(),
        group = new Group({pages: new PageCollection([page])});

      page.remove();

      expect(group.isEmpty()).toBe(true);
    });
  });

  describe('#removeAllLinks', function () {
    describe('the outgoing links', function () {
      it('removes them from the start knob', function () {
        var knob = new Knob(),
          page = new Page({knobs: new KnobCollection([knob])}),
          anotherPage = new Page();
        knob.linkTo(anotherPage);

        page.removeAllLinks();

        expect(knob.get('links').isEmpty()).toBe(true);
      });

      it('removes them from the end page', function () {
        var knob = new Knob(),
          page = new Page({knobs: new KnobCollection([knob])}),
          anotherPage = new Page();
        knob.linkTo(anotherPage);

        page.removeAllLinks();

        expect(anotherPage.get('incommingLinks').isEmpty()).toBe(true);
      });
    });

    describe('the incomming links', function () {
      it('removes them from the start page', function () {
        var knob = new Knob(),
          page = new Page({knobs: new KnobCollection([knob])}),
          anotherPage = new Page();
        knob.linkTo(anotherPage);

        anotherPage.removeAllLinks();

        expect(knob.get('links').isEmpty()).toBe(true);
      });

      it('removes them from the end page', function () {
        var knob = new Knob(),
          page = new Page({knobs: new KnobCollection([knob])}),
          anotherPage = new Page();
        knob.linkTo(anotherPage);

        anotherPage.removeAllLinks();

        expect(anotherPage.get('incommingLinks').isEmpty()).toBe(true);
      });
    });

    describe('the successor links', function () {
      it('resets the link to the predecessor', function() {
        var first = new Page(),
          second = new Page();
        first.makePredecessorOf(second);

        second.removeAllLinks();

        expect(first.successor()).toBeFalsy();
        expect(second.get('predecessors').isEmpty()).toBeTruthy();
      });

      it('resets the link to the successor', function() {
        var first = new Page(),
          second = new Page();
        first.makePredecessorOf(second);

        first.removeAllLinks();

        expect(first.successor()).toBeFalsy();
        expect(second.get('predecessors').isEmpty()).toBeTruthy();
      });
    });
  });

  describe('#makePredecessorOf', function () {
    it('makes it a predecessor', function () {
      var first = new Page(),
        second = new Page();

        first.makePredecessorOf(second);

        expect(first.successor()).toEqual(second);
        expect(second.get('predecessors').contains(first)).toBeTruthy();
    });

    it('it removes it from the list of predecessors of old node', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page();
      first.makePredecessorOf(second);

      first.makePredecessorOf(third);

      expect(second.get('predecessors').contains(first)).toBeFalsy();
    });
  });

  describe('#removeSuccessorLink', function () {
    it('resets the successor', function () {
      var first = new Page(),
        second = new Page();
      first.makePredecessorOf(second);

      first.removeSuccessorLink();

      expect(second).not.toBeSuccessorOf(first);
    });

    it('splits the group if link in group', function () {
      var graph = Graph.create()
        .lane()
          .group()
            .page('A').end()
            .page('B').end()
            .end()
          .end()
        .end();

      var page = graph.group(0, 0).page(0);

      page.removeSuccessorLink();

      expect(graph.lane(0).length).toEqual(2);
    });
  });
});
