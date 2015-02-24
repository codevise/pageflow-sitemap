pageflow.sitemap.followLinksView = pageflow.sitemap.groupView.define('follow_link', function(s) {
  this.child('path', function() {
    this.update()
      .attr("d", sitemap.followPath)
    ;
  });
});