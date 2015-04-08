pageflow.sitemap.textLabelView = pageflow.sitemap.groupView.define('text_label', function(s) {
  var padding = this.options.padding || 5;
  var dist = 10;

  this.update()
    .classed('empty', function(d) { return !d.label; })
    .attr('transform', s.utils.fn.translate('x', 'y'))
  ;

  this.child('rect');

  this.child('text', function() {
    this.update()
      .attr('transform', s.utils.translate(-dist, -dist))
      .text(s.utils.fn.d('label'))
    ;
  });

  this.update().each(function(d) {
    resizeRectToText(this.getElementsByTagName('rect'),
                     this.getElementsByTagName('text'));
  });

  function resizeRectToText(rect, text) {
    var textRect = text[0].getBoundingClientRect();

    d3.selectAll(rect)
      .attr('transform', s.utils.translate(-textRect.width - padding - dist,
                                           -textRect.height - padding / 2 - dist))
      .attr('width', textRect.width + 2 * padding)
      .attr('height', textRect.height + 2 * padding)
    ;
  }
});