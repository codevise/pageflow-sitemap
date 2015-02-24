pageflow.sitemap.SelectionNavigator = pageflow.Object.extend({
  initialize: function(options) {
    this.api = options.api || pageflow.editor;
    this.selection = options.selection;
    this.options = options;
  },

  attach: function() {
    this.listenToSelection('pages', function(page) {
      return '/pages/' + page.id;
    });

    this.listenToSelection('chapters', function(chapter) {
      return '/chapters/' + chapter.id;
    });

    this.listenToSelection('pageLinks', function(pageLink) {
      return pageLink.editPath ? pageLink.editPath() : this.options.emptySelectionPath;
    });
  },

  listenToSelection: function(name, path) {
    this.listenTo(this.selection, 'select:' + name, function(models) {
      if (models.length === 1) {
        this.api.navigate(path(models[0]), {trigger: true});
      }
      else if (models.length > 1) {
        this.api.navigate(this.options.multiSelectionPath, {trigger: true});
      }
      else {
        this.api.navigate(this.options.emptySelectionPath, {trigger: true});
      }
    });
  }
});