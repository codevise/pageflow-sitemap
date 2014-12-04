/*global Backbone, Link, LinkCollection*/
/*exported KnobCollection*/

var Knob = Backbone.Model.extend({
  initialize: function () {
    if (!this.get('links')) {
      this.set('links', new LinkCollection());
    }
    this.get('links').page = this;
    this.get('links').on('all', this._collectionChanged, this);
  },

  exceeded: function () {
    return typeof this.get('limit') === 'number' ? this.get('links').length >= this.get('limit') : false;
  },

  linkTo: function (target) {
    if (!this.exceeded()) {
      return new Link({ knob: this, target: target });
    }
  },

  removeLink: function(link) {
    this.get('links').remove(link);
  },

  removeAllLinks: function () {
    this.get('links').forEach(function (link) {
      link.get('target').get('incommingLinks').remove(link);
    });
    this.get('links').reset();
  },

  _collectionChanged: function (sourceEvent, item) {
    this.trigger('change', sourceEvent, item, this);
  }
});

var KnobCollection = Backbone.Collection.extend({
  model: Knob
});
