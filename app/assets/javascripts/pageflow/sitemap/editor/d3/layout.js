//= require_self
//= require ./layout/grid
//= require ./layout/dragging_decorator
//= require ./layout/collision

(function() {
  var s = pageflow.sitemap;

  s.layout = {
    defaultGrid: {
      pageWidth: 80,
      pageHeight: 80,
      pageMarginWidth: 30,
      pageMarginHeight: 20
    },

    create: function(entry, selection, options) {
      options = _.extend({
        grid: this.defaultGrid
      }, options || {});

      var originalLayout =
        new s.layout.Grid(pagesGroupedByChapters(entry),
                          options.grid);

      var draggingLayout =
        new s.layout.DraggingDecorator(selection,
                                       originalLayout,
                                       originalLayout,
                                       {delta: options.dragDelta});

      var collapsedLayout =
        new s.layout.Grid(draggingLayout.nonDraggedPagesGroupedByChapters,
                          options.grid);

      var collision =
        new s.layout.Collision(draggingLayout, collapsedLayout);

      var spacingLayout =
        new s.layout.Grid(collision.pagesGroupedByDragTargetChapters(),
                          options.grid);

      var layout =
        new s.layout.DraggingDecorator(selection,
                                       spacingLayout,
                                       originalLayout,
                                       {delta: options.dragDelta});

      return layout;
    }
  };

  function pagesGroupedByChapters(entry) {
    return entry.chapters.map(function(chapter) {
      return {
        chapter: chapter,
        pages: chapter.pages.toArray()
      };
    });
  }
}());