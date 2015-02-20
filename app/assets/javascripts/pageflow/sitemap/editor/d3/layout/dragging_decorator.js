pageflow.sitemap.layout.DraggingDecorator = function(selection, layout, selectionLayout, options) {
  var x = options.delta ? options.delta.x : 0;
  var y = options.delta ? options.delta.y : 0;

  var decorator = function() {
    this.position = function(target) {
      var pos = layout.position(target);

      if (selection.contains(target) ||
          (target.chapter && selection.contains(target.chapter))) {

        pos = selectionLayout.position(target);

        return {
          x: pos.x + x,
          y: pos.y + y
        };
      }
      else {
        return layout.position(target);
      }
    };

    this.isDragging = isDragging;

    this.draggedPages = options.delta ? selection.get('pages') : [];

    this.nonDraggedPagesGroupedByChapters = _(layout.pagesGroupedByChapters).map(function(group) {
      return {
        chapter: group.chapter,
        pages: _.reject(group.pages, isDragging)
      };
    });
  };

  decorator.prototype = layout;
  return new decorator();

  function isDragging(target) {
    return options.delta && selection.contains(target);
  }
};