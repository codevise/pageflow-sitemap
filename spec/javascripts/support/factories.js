var build = {
  pageIndex: 0,
  page: function (opts) {
    var options = opts || {};
    options.chapter_id = 1;

    var model = new pageflow.Page(options);
    return new Page({page: model, name: 'page-' + this.pageIndex++});
  },

  group: function (pages, configuration) {
    var collection = new pageflow.PagesCollection(_(pages).map(function (page) { return page.page(); }));
    var model = new pageflow.Chapter({id: 1}, {pages: collection });
    model.configuration = new Backbone.Model(configuration || {});

    return new Group({chapter: model, pages: new PageCollection(pages)});
  },

  lane: function () {
    var lane = new Lane([].slice.call(arguments));
    this.graph.addLane(lane);
    return lane;
  }
};

beforeEach(function () {
  build.graph = new Graph({lanes: []});
});
