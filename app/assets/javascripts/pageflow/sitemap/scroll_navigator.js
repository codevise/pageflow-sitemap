pageflow.sitemap.ScrollNavigator = function() {
  function goToConfiguredSuccessor(currentPage) {
    var configuration = currentPage.page('getConfiguration');

    if('scroll_successor_id' in configuration) {
      return pageflow.slides.goToByPermaId(configuration.scroll_successor_id);
    }

    return false;
  }

  function hasConfiguredSuccessor(currentPage, pages) {
    return !!configuredSuccessor(currentPage, pages).length;
  }

  function configuredSuccessor(currentPage, pages) {
    var configuration = currentPage.page('getConfiguration');

    if ('scroll_successor_id' in configuration) {
      return pages.filter('#' + configuration.scroll_successor_id);
    }

    return $();
  }

  function goToPreviousPageInChapter(currentPage) {
    return goToPageInChapter(currentPage, currentPage.prev('.page'), {position: 'bottom'});
  }

  function goToNextPageInChapter(currentPage) {
    return goToPageInChapter(currentPage, currentPage.next('.page'));
  }

  function nextPageInChapter(currentPage) {
    var page = currentPage.next('.page');

    if (sameChapter(currentPage, page)) {
      return page;
    }

    return $();
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

  this.nextPageExists = function(currentPage, pages) {
    return sameChapter(currentPage, currentPage.next('.page')) ||
      hasConfiguredSuccessor(currentPage, pages);
  };

  this.previousPageExists = function(currentPage, pages) {
    return sameChapter(currentPage, currentPage.prev('.page'));
  };

  this.getNextPage = function(currentPage, pages) {
    return nextPageInChapter(currentPage) ||
      configuredSuccessor(currentPage, pages);
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
