describe('pageflow.sitemap.layout.DraggingDecorator', function() {
  var s = pageflow.sitemap;
  var l = pageflow.sitemap.layout;
  var f = support.factories;

  var options = {rowHeight: 100, laneWidth: 100};

  describe('#position', function() {
    it('returns translated position if dragged', function() {
      var chapter = f.chapter();
      var selection = new s.Selection();
      var layout = {
        position: sinon.stub().returns({x: 100, y: 200})
      };
      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      selection.select('chapters', [chapter]);
      var pos = draggingLayout.position(chapter);

      expect(pos).to.deep.eq({x: 110, y: 215});
    });

    it('returns untranslated position if not dragged', function() {
      var chapter = f.chapter();
      var selection = new s.Selection();
      var layout = {
        position: sinon.stub().returns({x: 100, y: 200})
      };
      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      var pos = draggingLayout.position(chapter);

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
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      expect(draggingLayout.pagesGroupedByChapters).to.eq(groups);
    });
  });

  describe('#nonDraggedPagesGroupedByChapters', function() {
    it('filters out dragged pages', function() {
      var chapter = f.chapter();
      var page0 = f.page(chapter);
      var page1 = f.page(chapter);
      var selection = new s.Selection({pages: [page1]});
      var groups = [{
        chapter: chapter,
        pages: [page0, page1]
      }];
      var layout = {
        pagesGroupedByChapters: groups
      };

      var draggingLayout = new l.DraggingDecorator(selection,
                                                   layout,
                                                   layout,
                                                   {delta: {x: 10, y: 15}});

      expect(draggingLayout.nonDraggedPagesGroupedByChapters).to.deep.eq([{
        chapter: chapter,
        pages: [page0]
      }]);
    });
  });
});