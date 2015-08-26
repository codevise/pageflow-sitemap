pageflow.sitemap.layout.DraggingDecorator = function(selection, layout, selectionLayout, options) {
  var x = options.delta ? options.delta.x : 0;
  var y = options.delta ? options.delta.y : 0;

  var decorator = function() {
    this.position = function(target) {
      var pos = layout.position(target);

      if (selection.contains(target) ||
          (target.chapter && selection.contains(target.chapter)) ||
          (target.chapter && target.chapter.storyline && selection.contains(target.chapter.storyline)) ||
          (target.storyline && selection.contains(target.storyline))) {

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

    this.draggedChapters = options.delta ? selection.get('chapters') : [];

    this.nonDraggedChaptersGroupedByStorylines = _(layout.chaptersGroupedByStorylines).map(function(group) {
      return {
        storyline: group.storyline,
        chapters: _.reject(group.chapters, isDragging)
      };
    });

    this.draggedPages = options.delta ? selection.get('pages') : [];

    this.nonDraggedPagesGroupedByChapters = _.chain(layout.pagesGroupedByChapters)
      .reject(function(group) {
        return group.chapter && isDragging(group.chapter);
      })
      .map(function(group) {
        return {
          chapter: group.chapter,
          pages: _.reject(group.pages, isDragging)
        };
      })
      .value();
  };

  decorator.prototype = layout;
  return new decorator();

  function isDragging(target) {
    return options.delta && selection.contains(target);
  }
};