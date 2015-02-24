pageflow.sitemap.layout.LinkDraggingDecorator = function(selection, layout, options) {
  var decorator = function() {
    this.linkTarget = function(page, link) {
      if (selection.contains(link) && options.dragPosition) {
        var targetPage = layout.pageFromPoint(options.dragPosition);

        if (targetPage) {
          return layout.linkTarget(targetPage, link);
        }
        else {
          return {
            x: options.dragPosition.x,
            y: options.dragPosition.y,
            width: 0,
            height: 0
          };
        }
      }
      else {
        return layout.linkTarget(page, link);
      }
    };

    this.isDragging = function(target) {
      return (options.dragPosition && selection.contains(target)) ||
        layout.isDragging(target);
    };
  };

  decorator.prototype = layout;
  return new decorator();
};