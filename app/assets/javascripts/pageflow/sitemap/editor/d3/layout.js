//= require_self
//= require ./layout/grid
//= require ./layout/dragging_decorator
//= require ./layout/link_dragging_decorator
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

      // We begin by layouting chapters and pages in a grid.

      var originalLayout =
        new s.layout.Grid(pagesGroupedByChapters(entry),
                          options.grid);

      // Then we create a layout in which the selected pages are
      // translated by the dragDelta.

      var draggingLayout =
        new s.layout.DraggingDecorator(selection,
                                       originalLayout,
                                       originalLayout,
                                       {delta: options.dragDelta});

      // When dragging pages, the reset of the layout collapses as if
      // the dragged pages were removed. This is the layout we want to
      // consider when we check collision with dragged pages.

      var collapsedLayout =
        new s.layout.Grid(draggingLayout.nonDraggedPagesGroupedByChapters,
                          options.grid);

      // Group pages as if they already had been dropped into a target
      // new chapters. This allows us to calculate a grid layout with
      // free spaces where pages would be dropped.

      var collision =
        new s.layout.Collision(draggingLayout, collapsedLayout);

      var spacingLayout =
        new s.layout.Grid(collision.pagesGroupedByDragTargetChapters(),
                          options.grid);

      // The final layout that we want to draw is split into two
      // parts: For the selected pages, we want to use the position
      // from the original layout translated by the dragDelta. For all
      // other pages we want to use the positions from the spacing
      // layout which already contains placeholder positions for the
      // dragged pages.

      var layout = new s.layout.DraggingDecorator(selection,
                                                  spacingLayout,
                                                  originalLayout,
                                                  {delta: options.dragDelta});

      return new s.layout.LinkDraggingDecorator(selection,
                                                layout,
                                                {dragPosition: options.dragPosition});
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