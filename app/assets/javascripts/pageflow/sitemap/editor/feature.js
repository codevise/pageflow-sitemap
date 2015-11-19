pageflow.features.register('editor', 'sitemap', function() {
  var s = pageflow.sitemap;
  var currentSitemapView = null;

  pageflow.editor.selectPage = function (options) {
    options = options || {};

    var result = $.Deferred();
    var controller = new s.SelectionModeController(pageflow.entry, options);
    var graphView = new s.SitemapView({
      controller: controller,
      headerText: I18n.t(options.header || 'pageflow.sitemap.editor.headers.select_page'),
      cancelButton: true
    });

    if (currentSitemapView) {
      result.always(showSitemap);
    }

    controller.once('selected', function (selected) {
      graphView.close();
      result.resolve(selected);
    });

    graphView.once('closed', result.reject);

    pageflow.editor.showViewInMainPanel(graphView);

    return result.promise();
  };

  pageflow.editor.registerMainMenuItem({
    translationKey: 'pageflow.sitemap.editor.main_menu_item',
    click: function() {
      showSitemap();
      this.blur();
    }
  });

  pageflow.editor.on('scaffold:storyline', function(storyline) {
    if (!storyline.configuration.has('lane')) {
      storyline.configuration.set({
        row: 0,
        lane: firstEmptyLane()
      });
    }
  });

  function firstEmptyLane() {
    return Math.max(-1, _.max(pageflow.storylines.map(function(storyline) {
      return storyline.configuration.get('lane') || 0;
    }))) + 1;
  }

  pageflow.editor.on('add:chapter', function(chapter) {
    rearrangeLane(chapter.storyline);
  });

  pageflow.editor.on('add:page', function(page) {
    rearrangeLane(page.chapter.storyline);
  });

  function rearrangeLane(changedStoryline) {
    var storylinesBelow = pageflow.storylines.select(function(storyline) {
      return (storyline.configuration.get('lane') ===
              changedStoryline.configuration.get('lane') &&
              storyline.configuration.get('row') >
              changedStoryline.configuration.get('row'));
    });

    if (!storylinesBelow.length) {
      return;
    }

    var minRowBelow = _.min(_(storylinesBelow).map(function(storyline) {
      return storyline.configuration.get('row');
    }));

    var height = Math.ceil(changedStoryline.chapters.reduce(function(result, chapter) {
      return result + chapter.pages.length + 0.5;
    }, 0) + 0.5);

    var delta = changedStoryline.configuration.get('row') + height - minRowBelow;

    if (delta > 0) {
      _(storylinesBelow).each(function(storyline) {
        storyline.configuration.set({
          row: (storyline.configuration.get('row') || 0) + delta
        });
      });
    }
  }

  $(document).on('keydown', function(event) {
    if (event.altKey && event.which === 83) {
      toggleSitemap();
    }
  });

  function toggleSitemap() {
    if (currentSitemapView) {
      hideSitemap();
    }
    else {
      showSitemap();
    }
  }

  function showSitemap() {
    if (!currentSitemapView) {
      currentSitemapView = new s.SitemapView({
        controller: new s.EditorModeController(pageflow.entry)
      });

      currentSitemapView.once('close', function() {
        currentSitemapView = null;
      });

      pageflow.editor.showViewInMainPanel(currentSitemapView);
    }
  }

  function hideSitemap() {
    currentSitemapView.close();
  }
});