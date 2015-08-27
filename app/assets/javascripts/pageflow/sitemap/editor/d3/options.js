/*global options*/
  window.options = sitemap.settings = {
    margin: {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60
    },
    page: {
      height: 70,
      width: 125,
      verticalMargin: 30,
      horizontalMargin: 30
    },

    arrowSize: 8,

    radius: 20,
    duration: 400,

    panSpeed: 200,
    panBoundary: 20 // Within 20px from edges will pan when dragging.
  };

  options.boxHeight = options.page.width + options.page.verticalMargin;
