describe('pageflow.sitemap.layout', function() {
  var s = pageflow.sitemap;
  var f = support.factories;

  describe('.create', function() {
    it('creates a layout', function() {
      var entry = f.entry();
      var chapter = f.chapter(entry, {configuration: {lane: 0, row: 0}});
      var otherChapter = f.chapter(entry, {configuration: {lane: 1, row: 0}});
      var page = f.page(chapter);
      var draggedPage = f.page(otherChapter);
      var selection = new s.Selection({pages: [draggedPage]});

      var layout = s.layout.create(entry, selection, {
        dragDelta: {
          x: 10,
          y: 20
        },
        grid: {
          pageHeight: 60,
          pageWidth: 60,
          pageMarginWidth: 20,
          pageMarginHeight: 20,
        }
      });

      expect(layout.position(page)).to.deep.eq({x: 0, y: 0});
      expect(layout.position(draggedPage)).to.deep.eq({x: 110, y: 20});
    });
  });
});