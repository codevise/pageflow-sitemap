pageflow.sitemap.ScrollNavigator = function(slideshow, history) {
  function goToConfiguredSuccessor(currentPage) {
    var configuration = currentPage.page('configuration');

    if('scroll_successor_id' in configuration) {
      return slideshow.goToByPermaId(configuration.scroll_successor_id, {direction: 'forwards'});
    }

    return false;
  }

  function goToPreviousPageInChapter(currentPage) {
    return goToPageInChapter(currentPage, currentPage.prev('.page'), {direction: 'backwards', position: 'bottom'});
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

  function goToPreviouslyVisitedPage() {
    return history.back();
  }

  this.back = function(currentPage) {
    return goToPreviouslyVisitedPage() ||
      goToPreviousPageInChapter(currentPage);
  };

  this.next = function(currentPage) {
    return goToNextPageInChapter(currentPage) ||
      goToConfiguredSuccessor(currentPage);
  };
};
