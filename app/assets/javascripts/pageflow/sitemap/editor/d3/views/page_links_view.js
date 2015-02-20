pageflow.sitemap.pageLinksView = pageflow.sitemap.groupView.define('page_link', function(v, s) {
  v.update()
    .classed('selected', s.utils.fn.d('selected'))
  ;

  v.child('path.selection_highlight', function(v) {
    v.update()
      .attr('d', sitemap.linkpath)
    ;
  });

  v.child('path.arrow', function(n) {

    n.update()
      .attr('d', sitemap.linkpath)
    ;
  });

  v.child('path.selection_target', function(n) {
    n.enter()
      .on('click', v.options.click)
      .on('mouseover', function() {
        d3.select(this.parentNode).classed('highlight', true);
      })
      .on('mouseout', function() {
        d3.select(this.parentNode).classed('highlight', false);
      })
    ;

    n.update()
      .attr('d', sitemap.linkpath);
  });
});