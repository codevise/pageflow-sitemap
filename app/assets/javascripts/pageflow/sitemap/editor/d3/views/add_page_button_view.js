pageflow.sitemap.addPageButtonView = pageflow.sitemap.groupView.define('add_page', function(s) {
  this.update()
    .attr('transform', s.utils.fn.translate('x', 'y'))
  ;

  this.child('circle', function() {
    this.enter()
      .attr('r', 10)
      .on('click', s.utils.fn.trigger(this.options.click))
    ;
  });

  this.child('text', function() {
    this.enter()
      .text("\u2795");
  });
});