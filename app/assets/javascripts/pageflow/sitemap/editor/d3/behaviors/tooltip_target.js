sitemap.behavior = sitemap.behavior || {};

sitemap.behavior.tooltipTarget = function(translationKey) {
  function behavior(g) {
    g
      .on('mouseover.tooltipTarget', function() {
        var rect = d3.event.target.getBoundingClientRect();

        $(d3.event.target).trigger('requesttooltip', [{
          translationKey: translationKey,
          position: {
            left: rect.right,
            top: rect.top + rect.height / 2
          }
        }]);
      })
      .on('mouseout.tooltipTarget', function() {
        $(d3.event.target).trigger('resettooltip');
      })
    ;
  }

  return behavior;
};