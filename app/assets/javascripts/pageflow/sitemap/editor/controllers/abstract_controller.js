/*globals _, sitemap, pageflow */

sitemap.AbstractController = pageflow.Object.extend({
  initialize: function (graph) {
    this.graph = graph;
  },

  groupSelected: function (group) {},

  groupDroppedOnPlaceholder: function (group, placeholder) {},

  groupDroppedOnArea: function (group, target, position) {},

  pageSelected: function (page) {},

  pageDroppedOnPlaceholder: function (page, placeholder) {},

  pageDroppedOnArea: function (page, target, position) {},

  addPageAfter: function (page, x, y) {},

  knobDroppedOnPage: function (knob,  page) {},

  successorKnobDroppedOnPage: function (group,  page) {},

  linkPathSelected: function (link) {},

  followPathSelected: function (page) {},

  successorPathSelected: function (page) {},

  placeholderSelected: function (placeholder) {},

  addUpdateHandler: function (handler) {
    handler(this.graph);

    var updateTimeout;
    this.graph.on('change', function () {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(_.bind(handler, this, this), 100);
    });
  }

});

_.extend(sitemap.AbstractController, Backbone.Events);