/*global pageflow, _*/
pageflow.sitemap.ScrollNavigator = function(slideshow, configurations) {
  var predecessorIds = _(configurations).reduce(function(result, configuration, permaId) {
    result[configuration.scroll_successor_id] = permaId;
    return result;
  }, {});

  function goToConfiguredSuccessor(configuration) {
    if('scroll_successor_id' in configuration) {
      slideshow.goToByPermaId(configuration.scroll_successor_id);
      return true;
    }
    return false;
  }

  function goToConfiguredPredecessor(currentPage) {
    return slideshow.goToById(predecessorIds[currentPage.data('id')]);
  }

  function goToPreviousPageInChapter(currentPage) {
    slideshow.goTo(currentPage.prev('.page'));
    return true;
  }

  function goToNextPageInChapter(currentPage) {
    slideshow.goTo(currentPage.next('.page'));
    return true;
  }

  function historyBack() {
    history.back();
    return true;
  }

  this.back = function(currentPage, configuration) {
    return historyBack() ||
      goToPreviousPageInChapter(currentPage) ||
      goToConfiguredPredecessor(currentPage);
  };

  this.next = function(currentPage, configuration) {
    return goToConfiguredSuccessor(configuration) ||
      goToNextPageInChapter(currentPage);
  };
};
