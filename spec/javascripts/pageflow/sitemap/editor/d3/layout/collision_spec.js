describe('pageflow.sitemap.layout.Collision', function() {
  var s = pageflow.sitemap;
  var l = pageflow.sitemap.layout;
  var f = support.factories;

  describe('#pagesGroupedByDragTargetChapters', function() {
    it('moves selected pages above drag target page', function() {
      var sourceChapter = f.chapter();
      var targetChapter = f.chapter();
      var draggedPage = f.page(sourceChapter);
      var otherSourcePage = f.page(sourceChapter);
      var targetPage = f.page(targetPage);
      var selection = new s.Selection({pages: [draggedPage]});

      var draggedLayout = {
        draggedPages: [draggedPage],
        position: sinon.stub().returns({x: 110, y: 200}),
      };

      var targetLayout = {
        isAbovePage: sinon.stub().returns(false),

        isBelowChapter: sinon.stub().returns(false),

        pagesGroupedByChapters: [
          {
            chapter: sourceChapter,
            pages: [otherSourcePage]
          },
          {
            chapter: targetChapter,
            pages: [targetPage]
          }
        ]
      };
      targetLayout.isAbovePage.withArgs(targetPage, {x: 110, y: 200}).returns(true);

      var collision = new l.Collision(draggedLayout, targetLayout);
      var result = collision.pagesGroupedByDragTargetChapters();

      expect(result).to.deep.eq([
        {
          chapter: sourceChapter,
          pages: [otherSourcePage]
        },
        {
          chapter: targetChapter,
          pages: [draggedPage, targetPage]
        },
      ]);
    });

    it('moves selected pages to end of drag target chapter', function() {
      var sourceChapter = f.chapter();
      var targetChapter = f.chapter();
      var draggedPage = f.page(sourceChapter);
      var otherSourcePage = f.page(sourceChapter);
      var targetPage = f.page(targetPage);
      var selection = new s.Selection({pages: [draggedPage]});

      var draggedLayout = {
        draggedPages: [draggedPage],
        position: sinon.stub().returns({x: 110, y: 200}),
      };

      var targetLayout = {
        isAbovePage: sinon.stub().returns(false),

        isBelowChapter: sinon.stub().returns(false),

        pagesGroupedByChapters: [
          {
            chapter: sourceChapter,
            pages: [otherSourcePage]
          },
          {
            chapter: targetChapter,
            pages: [targetPage]
          }
        ]
      };
      targetLayout.isBelowChapter.withArgs(targetChapter, {x: 110, y: 200}).returns(true);

      var collision = new l.Collision(draggedLayout, targetLayout);
      var result = collision.pagesGroupedByDragTargetChapters();

      expect(result).to.deep.eq([
        {
          chapter: sourceChapter,
          pages: [otherSourcePage]
        },
        {
          chapter: targetChapter,
          pages: [targetPage, draggedPage]
        },
      ]);
    });
  });
});