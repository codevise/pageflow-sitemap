pageflow.sitemap.pageLinksView = pageflow.sitemap.groupView.define('page_link', function(s) {
  this.update()
    .classed('selected', s.utils.fn.d('selected'))
  ;

  this.child('path.selection_highlight', function() {
    this.update()
      .attr('d', sitemap.linkpath)
    ;
  });

  this.child('path.arrow', function() {
    this.update()
      .attr('d', sitemap.linkpath)
    ;
  });

  this.child('path.selection_target', function() {
    this.enter()
      .on('click', this.options.click)
      .on('mouseover', function() {
        d3.select(this.parentNode).classed('highlight', true);
      })
      .on('mouseout', function() {
        d3.select(this.parentNode).classed('highlight', false);
      })
    ;

    this.update()
      .attr('d', sitemap.linkpath);
  });
});