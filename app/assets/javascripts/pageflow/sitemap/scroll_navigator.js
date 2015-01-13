/*global pageflow, _*/
pageflow.sitemap.ScrollNavigator = function(slideshow, configurations) {
  var predecessorIds = _(configurations).reduce(function(result, configuration, permaId) {
    result[configuration.scroll_successor_id] = permaId;
  }, {});

  function goToConfiguredSuccessor(configuration) {
    slideshow.goToByPermaId(configuration.scroll_successor_id);
  }

  function goToConfiguredPredecessor(currentPage) {
    return slideshow.goToById(predecessorIds[currentPage.data('id')]);
  }

  function goToPreviousPageInChapter(currentPage) {
    slideshow.goTo(currentPage.prev('.page'));
  }

  function goToNextPageInChapter(currentPage) {
    slideshow.goTo(currentPage.next('.page'));
  }

  function historyBack() {
    history.back();
  }

  this.back = function(currentPage, configuration) {
    return historyBack() ||
      goToPreviousPageInChapter(currentPage) ||
      goToConfiguredPredecessor();
  };

  this.next = function(currentPage, configuration) {
    return goToConfiguredSuccessor(configuration) ||
      goToNextPageInChapter(currentPage);
  };
};
