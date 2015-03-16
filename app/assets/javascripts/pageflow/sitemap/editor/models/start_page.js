pageflow.sitemap.startPage = {
  update: function(entry, newStartPage) {
    entry.pages.each(function(page) {
      if (page === newStartPage) {
        page.configuration.set('start_page', true);
      }
      else if (page.configuration.get('start_page')) {
        page.configuration.unset('start_page');
      }
    });
  }
};