/*global Backbone, Link, LinkCollection*/
/*exported KnobCollection*/

var Knob = Backbone.Model.extend({
  initialize: function (attributes, options) {

    if (!('pageLinks' in options)) {
      throw('no pagelinks passed to Knob');
    }
    this.pageLinks = options.pageLinks;

    // FIXME: links attribute needs to go
    if (!this.get('links')) {
      this.set('links', new LinkCollection());
    }
    this.get('links').page = this;
    this.pageLinks.on('all', this._collectionChanged, this);
  },

  exceeded: function () {
    return !this.pageLinks.canAddLink();
  },

  linkTo: function (target) {
    if (!this.exceeded()) {
      var permaId = target.page().get('perma_id');
      return this.pageLinks.addLink(permaId);
    }
  },

  removeLink: function(link) {
    this.pageLinks.removeLink(link);
  },

  removeAllLinks: function () {
    this.pageLinks.forEach(function (link) {
      this.pageLinks.removeLink(link);
    });
  },

  _collectionChanged: function (sourceEvent, item) {
    this.trigger('change', sourceEvent, item, this);
  }
});

var KnobCollection = Backbone.Collection.extend({
  model: Knob
});
