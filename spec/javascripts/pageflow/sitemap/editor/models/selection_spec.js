describe('pageflow.sitemap.Selection', function() {
  var s = pageflow.sitemap;

  describe('#contains', function() {
    it('returns true if page is selected', function() {
      var selection = new s.Selection();
      var page = {};

      selection.select('pages', [page]);

      expect(selection.contains(page)).to.eq(true);
    });
  });

  describe('#select', function() {
    it('resets previous selection', function() {
      var selection = new s.Selection();
      var page = {};
      var chapter = {};

      selection.select('pages', [page]);
      selection.select('chapters', [chapter]);

      expect(selection.get('pages')).to.deep.eq([]);
    });

    it('triggers select:<name> event', function() {
      var selection = new s.Selection();
      var page = {};
      var handler = sinon.spy();

      selection.on('select:pages', handler);
      selection.select('pages', [page]);

      expect(handler).to.have.been.calledWith([page]);
    });

    describe('with additive option', function() {
      it('adds model of same type', function() {
        var selection = new s.Selection();
        var page0 = {};
        var page1 = {};

        selection.select('pages', [page0]);
        selection.select('pages', [page1], {additive: true});

        expect(selection.get('pages')).to.deep.eq([page0, page1]);
      });

      it('resets previous selection of other type', function() {
        var selection = new s.Selection();
        var page = {};
        var chapter = {};

        selection.select('chapters', [chapter]);
        selection.select('pages', [page], {additive: true});

        expect(selection.get('chapters')).to.deep.eq([]);
      });
    });
  });
});