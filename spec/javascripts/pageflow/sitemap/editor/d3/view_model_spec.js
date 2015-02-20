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

    expect(viewModel.pages[0].selected).to.eq(true);
  });

  it('applies dragDx and dragDy to selected page', function() {
    var entry = f.entry();
    var chapter = f.chapter(entry);
    var page = f.page(chapter);
    var selection = new s.Selection();

    selection.select('pages', [page]);
    var viewModel = new s.ViewModel(entry, selection, {dragDx: 10, dragDy: 10});

    expect(viewModel.pages[0].x).to.eq(10);
    expect(viewModel.pages[0].y).to.eq(10);
  });

  it('does not apply dragDx and dragDy to unselected page', function() {
    var entry = f.entry();
    var chapter = f.chapter(entry);
    var page = f.page(chapter);
    var selection = new s.Selection();

    var viewModel = new s.ViewModel(entry, selection, {dragDx: 10, dragDy: 10});

    expect(viewModel.pages[0].x).to.eq(0);
    expect(viewModel.pages[0].y).to.eq(0);
  });
});