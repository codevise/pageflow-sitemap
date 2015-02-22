pageflow.sitemap.layout.Combine = function(baseLayout, selection, selectionLayout) {
  var decorator = function() {
    this.chapterPosition = function(chapter) {
      if (selection.contains(chapter)) {
        return selectionLayout.chapterPosition(chapter);
      }
      else {
        return baseLayout.chapterPosition(chapter);
      }
    };

    this.pagePosition = function(page) {
      if (selection.contains(page)) {
        return selectionLayout.pagePosition(page);
      }
      else {
        return baseLayout.pagePosition(page);
      }
    };
  };

  decorator.prototype = baseLayout;
  return new decorator();
};