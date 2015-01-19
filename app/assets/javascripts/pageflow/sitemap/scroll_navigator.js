/*global pageflow, _, $*/
pageflow.sitemap.ScrollNavigator = function(slideshow, configurations) {
  var stack = [];

  slideshow.on('slideshowchangepage', function() {
    stack.push(slideshow.currentPage().data('id'));
  });

  stack.push(slideshow.currentPage().data('id'));

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
    return slideshow.goToById(predecessorIds[currentPage.data('id')], {direction: 'backwards', position: 'bottom'});
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
    stack.pop();

    if (stack.length) {
      slideshow.goToById(stack.pop(), {direction: 'backwards', position: 'bottom'});
      return true;
    }

    return false;
  }

  this.back = function(currentPage, configuration) {
    return goToPreviouslyVisitedPage() ||
      goToPreviousPageInChapter(currentPage) ||
      goToConfiguredPredecessor(currentPage);
  };

  this.next = function(currentPage, configuration) {
    return goToConfiguredSuccessor(configuration) ||
      goToNextPageInChapter(currentPage);
  };
};
