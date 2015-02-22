pageflow.sitemap.layout.Translate = function(layout, x, y) {
  var decorator = function() {
    this.chapterPosition = function(chapter) {
      var pos = layout.chapterPosition(chapter);

      return {
        x: pos.x + x,
        y: pos.y + y
      };
    };

    this.pagePosition = function(page) {
      var pos = layout.pagePosition(chapter);

      return {
        x: pos.x + x,
        y: pos.y + y
      };
    };
  };

  decorator.prototype = layout;
  return new decorator();
};