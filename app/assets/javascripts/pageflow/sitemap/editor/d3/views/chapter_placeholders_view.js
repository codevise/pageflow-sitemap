sitemap.chapterPlaceholdersView = sitemap.groupView.define('chapter_placeholder', function(s) {
  this.update()
    .attr('transform', function(d) {
      return s.utils.translate(d.x - d.width / 2, d.y - d.height / 2);
    })
  ;

  this.child('rect', function() {
    this.update()
      .attr('width', s.utils.fn.d('width'))
      .attr('height', s.utils.fn.d('height'))
    ;
  });

  this.child('text', function() {
    this.enter()
      .attr('transform', function(d) {
        return s.utils.translate(d.width / 2, d.height / 2);
      })
      .text('+');
  });
});
