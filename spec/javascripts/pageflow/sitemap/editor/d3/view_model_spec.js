describe('pageflow.sitemap.ViewModel', function() {
  var f = support.factories;
  var p = pageflow;
  var s = window.sitemap;

  it('sets selected property on pages from selection', function() {
    var entry = f.entry();
    var chapter = f.chapter(entry);
    var page = f.page(chapter);
    var selection = new s.Selection();

    selection.select('pages', [page]);
    var viewModel = new s.ViewModel(entry, selection);

    expect(viewModel.nodes[0].selected).to.eq(true);
  });
});