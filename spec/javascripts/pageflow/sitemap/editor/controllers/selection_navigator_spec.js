describe('pageflow.sitemap.SelectioNavigator', function() {
  var s = pageflow.sitemap;

  describe('on select:chapters', function() {
    it('navigates to chapter if only one is selected', function() {
      var api = {navigate: sinon.spy()};
      var selection = new s.Selection();
      var selectionNavigator = new s.SelectionNavigator({
        api: api,
        selection: selection
      });
      var chapter = new Backbone.Model({id: 6});

      selectionNavigator.attach();
      selection.select('chapters', [chapter]);

      expect(api.navigate).to.have.been.calledWith('/chapters/6', {trigger: true});
    });

    it('navigates to multiSelectionPath if more than one is selected', function() {
      var api = {navigate: sinon.spy()};
      var selection = new s.Selection();
      var selectionNavigator = new s.SelectionNavigator({
        api: api,
        selection: selection,
        multiSelectionPath: '/multi'
      });
      var chapter0 = new Backbone.Model({id: 6});
      var chapter1 = new Backbone.Model({id: 7});

      selectionNavigator.attach();
      selection.select('chapters', [chapter0, chapter1]);

      expect(api.navigate).to.have.been.calledWith('/multi', {trigger: true});
    });

    it('navigates to emptySelectionPath if more than one is selected', function() {
      var api = {navigate: sinon.spy()};
      var selection = new s.Selection();
      var selectionNavigator = new s.SelectionNavigator({
        api: api,
        selection: selection,
        emptySelectionPath: '/none'
      });

      selectionNavigator.attach();
      selection.select('chapters', []);

      expect(api.navigate).to.have.been.calledWith('/none', {trigger: true});
    });
  });
});