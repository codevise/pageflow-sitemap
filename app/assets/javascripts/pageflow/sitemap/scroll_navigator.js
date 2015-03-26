pageflow.sitemap.ScrollNavigator = function() {
  function goToConfiguredSuccessor(currentPage) {
    var configuration = currentPage.page('getConfiguration');

    if('scroll_successor_id' in configuration) {
      return pageflow.slides.goToByPermaId(configuration.scroll_successor_id);
    }

    return false;
  }

  function goToPreviousPageInChapter(currentPage) {
    return goToPageInChapter(currentPage, currentPage.prev('.page'), {position: 'bottom'});
  }

  function goToNextPageInChapter(currentPage) {
    return goToPageInChapter(currentPage, currentPage.next('.page'));
  }

  function goToPageInChapter(currentPage, targetPage, options) {
    if (sameChapter(currentPage, targetPage)) {
      pageflow.slides.goTo(targetPage, options);
      return true;
    }

    return false;
  }

  function goToPreviouslyVisitedPage() {
    return pageflow.history.back();
  }

  function sameChapter(page1, page2) {
    return (page1.data('chapterId') == page2.data('chapterId'));
  }

  this.getLandingPage = function(pages) {
    var result = pages.first();

    pages.each(function() {
      var page = $(this);
      var configuration = page.page('getConfiguration');

      if (configuration.start_page) {
        result = page;
      }
    });

    return result;
  };

  this.back = function(currentPage) {
    return goToPreviousPageInChapter(currentPage);
  };

  this.next = function(currentPage) {
    return goToNextPageInChapter(currentPage) ||
      goToConfiguredSuccessor(currentPage);
  };

  this.getTransitionDirection = function(previousPage, currentPage, options) {
    var direction;

    if (sameChapter(previousPage, currentPage)) {
      direction = (currentPage.index() > previousPage.index() ? 'forwards' : 'backwards');
    }
    else {
      direction = options.back ? 'backwards' : 'forwards';
    }

    return direction;
  };
};
