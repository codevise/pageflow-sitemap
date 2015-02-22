//= require_self
//= require ./layout/grid
//= require ./layout/dragging_decorator

(function() {
  var s = pageflow.sitemap;

  s.layout = {
    create: function(entry, selection, options) {
      options = options || {};

      var originalLayout =
        new s.layout.Grid(pagesGroupedByChapters(entry),
                          options.grid);

      var draggingLayout =
        new s.layout.DraggingDecorator(selection,
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
                                       {delta: options.dragDelta});

      return layout;
    }
  };

  function pagesGroupedByChapters(entry) {
    entry.chapters.reduce(function(result, chapter) {
      result.push({
        chapter: chapter,
        pages: chapter.pages.toArray()
      });
    }, []);
  }
}());