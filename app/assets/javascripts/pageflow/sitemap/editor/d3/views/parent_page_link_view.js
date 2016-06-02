sitemap.parentPageLinkView = sitemap.groupView.define('parent_page_link', function(s) {
  this.child('path', function() {
    this.update()
      .attr('d', polygon)
      .attr('fill', 'rgba(21, 89, 156, 0.08)');
  });

  function polygon(d) {
    var p = d.points;
    return 'M' + p[0] + 'L' + p[1] + 'L' + p[2] + 'L' + p[3];
  }
});
