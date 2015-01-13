/*global pageflow, _*/
pageflow.sitemap.ScrollNavigator = function(slideshow, configurations) {
  var predecessorIds = _(configurations).reduce(function(result, configuration, permaId) {
    result[configuration.scroll_successor_id] = permaId;
    return result;
  }, {});

  function goToConfiguredSuccessor(configuration) {
    if('scroll_successor_id' in configuration) {
      return slideshow.goToByPermaId(configuration.scroll_successor_id, {direction: 'forwards'});
    }
    return false;
  }

  function goToConfiguredPredecessor(currentPage) {
    return slideshow.goToById(predecessorIds[currentPage.data('id')], {direction: 'backwards'});
  }

  function goToPreviousPageInChapter(currentPage) {
    return goToPageInChapter(currentPage, currentPage.prev('.page'), {direction: 'backwards'});
  }

  function goToNextPageInChapter(currentPage) {
    return goToPageInChapter(currentPage, currentPage.next('.page'), {direction: 'forwards'});
  }

  function goToPageInChapter(currentPage, targetPage, options) {
    if (targetPage.data('chapterId') == currentPage.data('chapterId')) {
      slideshow.goTo(targetPage, options);
      return true;
    }

    return false;
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
