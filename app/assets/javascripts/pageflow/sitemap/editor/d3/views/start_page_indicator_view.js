pageflow.sitemap.startPageIndicatorView = pageflow.sitemap.groupView.define('start_page_indicator', function(s) {
  this.update()
    .attr('transform', s.utils.translate(-s.settings.page.width / 2,
                                         s.settings.page.height / 2 - 10))
  ;

  this.child('rect', function() {
    this.enter()
      .attr('transform', s.utils.translate(-11, -10))
      .attr('width', 27)
      .attr('height', 25)
    ;
  });

  this.child('text', function() {
    this.enter()
      .attr('transform', s.utils.translate(3, 3))
      .text("\ue741")
    ;
  });
});