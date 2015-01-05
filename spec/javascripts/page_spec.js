describe('Page', function() {
  describe('the incommingLinks property', function () {
    it('defaults to the empty collection', function () {
      expect(new Page().get('incommingLinks').models).to.be.empty;
    });

    it('triggers a change event if contained pages get linked', function () {
      var source = new Knob(),
        sourcePage = new Page({knobs: new KnobCollection([source])}),
        target = new Page(),
        listener = sinon.spy();
      target.on('change', listener);

      source.linkTo(target);

      expect(listener.called).to.be.true;
    });
  });

  describe('the predecessors property', function () {
    it('defaults to the empty collection', function () {
      expect(new Page().get('predecessors').models).to.be.empty;
    });
  });

  describe('#remove', function () {
    it('removes the page from the group', function () {
      var page = build.page(),
        group = build.group([page]);

      page.remove();

      expect(group.isEmpty()).to.be.true;
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

        expect(knob.get('links').isEmpty()).to.be.true;
      });

      it('removes them from the end page', function () {
        var knob = new Knob(),
          page = new Page({knobs: new KnobCollection([knob])}),
          anotherPage = new Page();
        knob.linkTo(anotherPage);

        page.removeAllLinks();

        expect(anotherPage.get('incommingLinks').isEmpty()).to.be.true;
      });
    });

    describe('the incomming links', function () {
      it('removes them from the start page', function () {
        var knob = new Knob(),
          page = new Page({knobs: new KnobCollection([knob])}),
          anotherPage = new Page();
        knob.linkTo(anotherPage);

        anotherPage.removeAllLinks();

        expect(knob.get('links').isEmpty()).to.be.true;
      });

      it('removes them from the end page', function () {
        var knob = new Knob(),
          page = new Page({knobs: new KnobCollection([knob])}),
          anotherPage = new Page();
        knob.linkTo(anotherPage);

        anotherPage.removeAllLinks();

        expect(anotherPage.get('incommingLinks').isEmpty()).to.be.true;
      });
    });

    describe('the successor links', function () {
      it('resets the link to the predecessor', function() {
        var first = new Page(),
          second = new Page();
        first.makePredecessorOf(second);

        second.removeAllLinks();

        expect(first.successor()).to.be.undefined;
        expect(second.get('predecessors').isEmpty()).to.be.true;
      });

      it('resets the link to the successor', function() {
        var first = new Page(),
          second = new Page();
        first.makePredecessorOf(second);

        first.removeAllLinks();

        expect(first.successor()).to.be.undefined;
        expect(second.get('predecessors').isEmpty()).to.be.true;
      });
    });
  });

  describe('#makePredecessorOf', function () {
    it('makes it a predecessor', function () {
      var first = new Page(),
        second = new Page();

        first.makePredecessorOf(second);

        expect(first.successor()).to.be.equal(second);
        expect(second.get('predecessors').contains(first)).to.be.true;
    });

    it('it removes it from the list of predecessors of old node', function () {
      var first = new Page(),
        second = new Page(),
        third = new Page();
      first.makePredecessorOf(second);

      first.makePredecessorOf(third);

      expect(second.get('predecessors').contains(first)).not.to.be.true;
    });
  });

  describe('#removeSuccessorLink', function () {
    it('resets the successor', function () {
      var first = new Page(),
        second = new Page();
      first.makePredecessorOf(second);

      first.removeSuccessorLink();

      expect(second).not.to.be.successorOf(first);
    });

    xit('splits the group if link in group', function () {
      var graph = build.graph,
        first = build.page(), second = build.page(),
        group = build.group([first, second]);
        lane = build.lane(group);

      first.removeSuccessorLink();

      expect(graph.lane(0).length).to.be.equal(2);
    });
  });
});
