describe('pageflow.sitemap.layout.DraggingDecorator', function() {
  var s = pageflow.sitemap;
  var l = pageflow.sitemap.layout;
  var f = support.factories;

  var options = {rowHeight: 100, laneWidth: 100};

  describe('#chapterPosition', function() {
    it('returns translated position if dragged', function() {
      var chapter = f.chapter();
      var selection = new s.Selection();
      var layout = {
        chapterPosition: sinon.stub().returns({x: 100, y: 200})
      };
      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      selection.select('chapters', [chapter]);
      var pos = draggingLayout.chapterPosition(chapter);

      expect(pos).to.deep.eq({x: 110, y: 215});
    });

    it('returns untranslated position if not dragged', function() {
      var chapter = f.chapter();
      var selection = new s.Selection();
      var layout = {
        chapterPosition: sinon.stub().returns({x: 100, y: 200})
      };
      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      var pos = draggingLayout.chapterPosition(chapter);

      expect(pos).to.deep.eq({x: 100, y: 200});
    });
  });

  describe('#pagePosition', function() {
    it('returns translated position if dragged', function() {
      var page = f.page();
      var selection = new s.Selection();
      var layout = {
        pagePosition: sinon.stub().returns({x: 100, y: 200})
      };
      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      selection.select('pages', [page]);
      var pos = draggingLayout.pagePosition(page);

      expect(pos).to.deep.eq({x: 110, y: 215});
    });

    it('returns untranslated position if not dragged', function() {
      var page = f.page();
      var selection = new s.Selection();
      var layout = {
        pagePosition: sinon.stub().returns({x: 100, y: 200})
      };
      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      var pos = draggingLayout.pagePosition(page);

      expect(pos).to.deep.eq({x: 100, y: 200});
    });
  });

  describe('#draggedPages', function() {
    it('contains selected pages if dragging', function() {
      var page = f.page();
      var selection = new s.Selection({pages: [page]});
      var layout = {};

      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      expect(draggingLayout.draggedPages).to.deep.eq([page]);
    });

    it('is empty if not dragging', function() {
      var page = f.page();
      var selection = new s.Selection({pages: [page]});
      var layout = {};

      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   {});

      expect(draggingLayout.draggedPages).to.deep.eq([]);
    });
  });

  describe('#pagesGroupedByChapters', function() {
    it('delegates to wrapped layout', function() {
      var page = f.page();
      var selection = new s.Selection({pages: [page]});
      var groups = [];
      var layout = {
        pagesGroupedByChapters: groups
      };

      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      expect(draggingLayout.pagesGroupedByChapters).to.eq(groups);
    });
  });
});