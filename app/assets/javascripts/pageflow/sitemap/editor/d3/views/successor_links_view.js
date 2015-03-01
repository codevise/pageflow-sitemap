pageflow.sitemap.successorLinksView =
  pageflow.sitemap.selectableLinksView('successor_link', pageflow.sitemap.successorPath, function(s) {
    this.call(s.addPageButtonView(addButtonData, {
      click: s.utils.fn.trigger(this.options.addPageButtonClick)
    }));

    function addButtonData(d) {
      var start = s.successorPath.points(d).start;

      return [{
        id: d.id + ':add_page',
        page: d.page,
        x: start.x,
        y: start.y + 30
      }];
    }
  });