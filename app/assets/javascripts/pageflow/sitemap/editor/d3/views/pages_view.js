/*global options*/

pageflow.sitemap.pagesView = pageflow.sitemap.groupView.define('page', function(s) {
  this.update()
    .classed('selected', function(d) { return d.selected; })
    .classed('highlighted', function(d) { return d.highlighted; })
    .classed('destroying', s.utils.fn.d('destroying'))
    .classed('disabled', s.utils.fn.d('disabled'))
    .attr('transform', transformStart)
    .transition().duration(options.duration)
    .attr('transform', transformFinal)
  ;

  this.enter()
    .call(sitemap.behavior.multiDrag({
      drag: this.options.drag,
      dragend: this.options.dragend
    }))
  ;

  var trX = -options.page.width / 2,
      trY = options.page.height / 2,
      opts = this.options;

  this.child('rect.bg', function() {
    this.enter()
      .attr('width', options.page.width)
      .attr('height', options.page.height)
      .attr('transform', 'translate(' + trX + ',' + (-trY) + ')')
      .on('mouseover', function(d) {
        d3.select(this.parentNode).classed('hover', true);
        d3.selectAll('[id^="link:' + d.pageCid +'"]').classed('highlight', true);
      })
      .on('mouseout', function(d) {
        d3.select(this.parentNode).classed('hover', false);
        d3.selectAll('.highlight').classed('highlight', false);
      })
      .on('click', s.utils.fn.trigger(this.options.click))
      .on('dblclick', s.utils.fn.trigger(this.options.dblclick))
      .on('mousedown', s.utils.fn.trigger(this.options.mousedown))
    ;
  });

  this.child('image', function() {
    this.enter()
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', options.page.width)
      .attr('height', options.page.height)
      .attr('transform', 'translate(' + trX + ',' + (-trY) + ')')
    ;

    this.update()
      .each(function(d) {
        d3.select(this)
          .attr('xlink:href', d.thumbnailUrl)
        ;
      })
    ;
  });

  this.child('rect.title', function() {
    this.enter()
      .attr('width', options.page.width)
      .attr('height', options.page.height)
      .attr('transform', 'translate(' + (trX) + ',' + (-trY) + ')')
    ;
  });

  this.child('rect.border', function() {
    this.enter()
      .attr('width', options.page.width + 8)
      .attr('height', options.page.height +8 )
      .attr('transform', 'translate(' + (trX -4) + ',' + (-trY -4) + ')')
    ;
  });

  this.enter()
    .append('foreignObject')
    .style('pointer-events', 'none')
    .attr('width', options.page.width-2)
    .attr('height', options.page.height)
    .attr('transform', 'translate(' + (trX+1) + ',' + (-trY) + ')')
    .append('xhtml:body')
    .html('<div class="title_text"></div>')
  ;

  this.update()
    .each(function(d) {
      d3.selectAll(this.getElementsByTagName('div')).text(d.title || '');
    })
  ;

  this.call(s.addButtonView(addPageButtonData, {
    tooltipTranslationKey: 'pageflow.sitemap.editor.tooltips.insert_page',
    click: s.utils.fn.trigger(this.options.addPageButtonClick)
  }));

  function addPageButtonData(d) {
    return [{
      id: d.id + ':add_page',
      page: d.page,
      left: trX - 1,
      top: 37,
      width: options.page.width + 2,
      height: 20
    }];
  }

  function transformStart(d) { return 'translate(' + d.x0 + ',' + d.y0 + ')'; }
  function transformFinal(d) { return 'translate(' + d.x + ',' + d.y + ')'; }
});