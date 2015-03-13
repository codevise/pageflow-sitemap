pageflow.sitemap.followLinksView = pageflow.sitemap.groupView.define('follow_link', function(s) {
  this.child('path', function() {
    this.update()
      .attr("d", sitemap.followPath)
      .attr('marker-end', 'url(#follow_triangle)')
    ;
  });

  this.call(s.addPageButtonView(addButtonData, {
    click: s.utils.fn.trigger(this.options.addPageButtonClick)
  }));

  function addButtonData(d) {
    var start = s.followPath.points(d).start;
    var end = s.followPath.points(d).end;

    return [{
      id: d.id + ':add_page',
      page: d.source.page,
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    }];
  }
});