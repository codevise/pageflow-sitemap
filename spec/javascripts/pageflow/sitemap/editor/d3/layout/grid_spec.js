describe('pageflow.sitemap.layout.Grid', function() {
  var l = pageflow.sitemap.layout;
  var f = support.factories;

  var options = {
    pageHeight: 60,
    pageWidth: 60,
    pageMarginWidth: 20,
    pageMarginHeight: 20
  };

  describe('#position', function() {
    it('returns chapter position accoring to coordinates', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var gridLayout = new l.Grid([{
        chapter: chapter,
        pages: []
      }], options);

      var pos = gridLayout.position(chapter);

      expect(pos).to.deep.eq({x: 100, y: 200});
    });

    it('returns page position according to chapter coordinates', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var page1 = f.page(chapter);
      var page2 = f.page(chapter);
      var gridLayout = new l.Grid([
        {
          chapter: chapter,
          pages: [page1, page2]
        }
      ], options);

      var pos1 = gridLayout.position(page1);
      var pos2 = gridLayout.position(page2);

      expect(pos1).to.deep.eq({x: 100, y: 200});
      expect(pos2).to.deep.eq({x: 100, y: 300});
    });
  });

  describe('#chapterHeight', function() {
    it('returns height of chapter', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var page1 = f.page(chapter);
      var page2 = f.page(chapter);
      var gridLayout = new l.Grid([
        {
          chapter: chapter,
          pages: [page1, page2]
        }
      ], options);

      var height = gridLayout.chapterHeight(chapter);

      expect(height).to.eq(60 + 20 + 20 + 60);
    });
  });

  describe('#isAbovePage', function() {
    it('returns true if position is centered above page', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var page = f.page(chapter);
      var gridLayout = new l.Grid([
        {
          chapter: chapter,
          pages: [page]
        }
      ], options);

      var result = gridLayout.isAbovePage(page, {x: 100, y: 190});

      expect(result).to.eq(true);
    });

    it('returns false if position is in lower half of page', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var page = f.page(chapter);
      var gridLayout = new l.Grid([
        {
          chapter: chapter,
          pages: [page]
        }
      ], options);

      var result = gridLayout.isAbovePage(page, {x: 100, y: 260});

      expect(result).to.eq(false);
    });
  });

  describe('#isBelowChapter', function() {
    it('returns true if position is centered below chapter', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var page = f.page(chapter);
      var gridLayout = new l.Grid([
        {
          chapter: chapter,
          pages: [page]
        }
      ], options);

      var result = gridLayout.isBelowChapter(chapter, {x: 100, y: 200 + 60 + 20});

      expect(result).to.eq(true);
    });

    it('returns false if position is too far up inside the chapter', function() {
      var chapter = f.chapter(f.entry(), {configuration: {row: 2, lane: 1}});
      var page = f.page(chapter);
      var gridLayout = new l.Grid([
        {
          chapter: chapter,
          pages: [page]
        }
      ], options);

      var result = gridLayout.isBelowChapter(chapter, {x: 100, y: 200 + 20});

      expect(result).to.eq(false);
    });
  });

  describe('#laneAndRowFromPoint', function() {
    it('maps point to row and lane', function() {
      var gridLayout = new l.Grid([], options);

      var result = gridLayout.laneAndRowFromPoint({x: 0, y: 100});

      expect(result).to.deep.eql({lane: 0, row: 1});
    });
  });
});