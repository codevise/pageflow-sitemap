pageflow.sitemap.layout.DraggingDecorator = function(selection, layout, options) {
  var x = options.delta ? options.delta.x : 0;
  var y = options.delta ? options.delta.y : 0;

  var decorator = function() {
    this.chapterPosition = function(chapter) {
      var pos = layout.chapterPosition(chapter);

      if (selection.contains(chapter)) {
        return {
          x: pos.x + x,
          y: pos.y + y
        };
      }
      else {
        return pos;
      }
    };

    this.pagePosition = function(page) {
      var pos = layout.pagePosition(page);

      if (selection.contains(page)) {
        return {
          x: pos.x + x,
          y: pos.y + y
        };
      }
      else {
        return pos;
      }
    };

    this.isDragging = function(target) {
      return options.delta && selection.contains(target);
    };

    this.draggedPages = options.delta ? selection.get('pages') : [];
  };

  decorator.prototype = layout;
  return new decorator();
};