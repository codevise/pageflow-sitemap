pageflow.sitemap.addButtonView = pageflow.sitemap.groupView.define('add_button', function(s) {
  this.update()
    .attr('transform', s.utils.fn.translate('left', 'top'))
  ;

  this.child('rect', function() {
    this.enter()
      .attr('width', s.utils.fn.d('width'))
      .attr('height', s.utils.fn.d('height'))
      .call(s.behavior.tooltipTarget(this.options.tooltipTranslationKey))
      .on('mouseover', function() {
        d3.select(this.parentNode).classed('hover', true);
      })
      .on('mouseout', function() {
        d3.select(this.parentNode).classed('hover', false);
      })
      .on('click', s.utils.fn.trigger(this.options.click))
    ;
  });

  this.child('text', function() {
    this.enter()
      .attr('transform', function(d) {
        return s.utils.translate(d.width / 2, d.height / 2);
      })
      .text("\u2795");
  });
});