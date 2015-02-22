describe('pageflow.sitemap.layout.Grid', function() {
  var l = pageflow.sitemap.layout;
  var f = support.factories;

  var options = {rowHeight: 100, laneWidth: 100};

  describe('#chapterPosition', function() {
    it('returns position accoring to coordinates', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var gridLayout = new l.Grid([{
        chapter: chapter,
        pages: []
      }], options);

      var pos = gridLayout.chapterPosition(chapter);

      expect(pos).to.deep.eq({x: 100, y: 200});
    });
  });

  describe('#pagePosition', function() {
    it('returns position of page according to chapter coordinates', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var page1 = f.page(chapter);
      var page2 = f.page(chapter);
      var gridLayout = new l.Grid([
        {
          chapter: chapter,
          pages: [page1, page2]
        }
      ], options);

      var pos1 = gridLayout.pagePosition(page1);
      var pos2 = gridLayout.pagePosition(page2);

      expect(pos1).to.deep.eq({x: 100, y: 200});
      expect(pos2).to.deep.eq({x: 100, y: 300});
    });
  });
});