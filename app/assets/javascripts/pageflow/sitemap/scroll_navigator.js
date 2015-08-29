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

  function goToPreviousPageInStoryline(currentPage) {
    return goToPageInStoryline(currentPage, currentPage.prev('.page'), {position: 'bottom'});
  }

  function goToNextPageInStoryline(currentPage) {
    return goToPageInStoryline(currentPage, currentPage.next('.page'));
  }

  function nextPageInStoryline(currentPage) {
    var page = currentPage.next('.page');

    if (sameStoryline(currentPage, page)) {
      return page;
    }

    return $();
  }

  function goToPageInStoryline(currentPage, targetPage, options) {
    if (sameStoryline(currentPage, targetPage)) {
      pageflow.slides.goTo(targetPage, options);
      return true;
    }

    return false;
  }

  function goToPreviouslyVisitedPage() {
    return pageflow.history.back();
  }

  function sameStoryline(page1, page2) {
    return pageflow.entryData.getStorylineIdByPagePermaId(page1.page('getPermaId')) ==
      pageflow.entryData.getStorylineIdByPagePermaId(page2.page('getPermaId'));
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
    return goToPreviousPageInStoryline(currentPage);
  };

  this.next = function(currentPage) {
    return goToNextPageInStoryline(currentPage) ||
      goToConfiguredSuccessor(currentPage);
  };

  this.nextPageExists = function(currentPage, pages) {
    return sameStoryline(currentPage, currentPage.next('.page')) ||
      hasConfiguredSuccessor(currentPage, pages);
  };

  this.previousPageExists = function(currentPage, pages) {
    return sameStoryline(currentPage, currentPage.prev('.page'));
  };

  this.getNextPage = function(currentPage, pages) {
    return nextPageInStoryline(currentPage) ||
      configuredSuccessor(currentPage, pages);
  };

  this.getTransitionDirection = function(previousPage, currentPage, options) {
    var direction;

    if (sameStoryline(previousPage, currentPage)) {
      direction = (currentPage.index() > previousPage.index() ? 'forwards' : 'backwards');
    }
    else {
      direction = options.back ? 'backwards' : 'forwards';
    }

    return direction;
  };
};
