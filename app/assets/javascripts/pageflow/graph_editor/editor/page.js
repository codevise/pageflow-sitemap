/*global Backbone, LinkCollection, KnobCollection, pageflow*/
/*exported Page, PageCollection */

var Page = Backbone.Model.extend({
  initialize: function() {
    ['incommingLinks', 'predecessors'].forEach(function (name) {
      if (!this.get()) {
        this.set(name, new LinkCollection());
      }
      this.get(name).page = this;
      this.get(name).on('all', this._collectionChanged, this);
    }, this);

    if (!this.get('knobs')) {
      this.set('knobs', new KnobCollection());
    }
    this.get('knobs').page = this;
    this.get('knobs').on('all', this._collectionChanged, this);
  },

  page: function() {
    return this.get('page');
  },

  group: function () {
    return this.get('group');
  },

  index: function() {
    return this.group().get('pages').indexOf(this);
  },

  successor: function () {
    return this.get('successor');
  },

  remove: function () {
    this.removeAllLinks();
    this.removeFromGroup();
  },

  removeAllLinks: function () {
    this.get('knobs').forEach(function (knob) {
      knob.removeAllLinks();
    });

    this.get('incommingLinks').forEach(function (link) {
      link.get('knob').removeLink(link);
    });
    this.get('incommingLinks').reset();

    this.resetPredecessors();
    this.resetSuccessor();
  },

  resetPredecessors: function() {
    this.get('predecessors').forEach(function (predecessor) {
      predecessor.unset('successor');
    });
    this.get('predecessors').reset();
  },

  resetSuccessor: function () {
    var successor = this.successor();
    if (successor) {
      successor.get('predecessors').remove(this);
      this.unset('successor');
    }
  },

  removeFromGroup: function () {
    var group = this.group();
    if (group) {
      this.unset('group');
      group.removePage(this);
    }
  },

  predecessorInGroup: function () {
    var group = this.group();
    return this.get('predecessors').find(function (predecessor) {
      return predecessor.get('group') === group;
    });
  },

  makePredecessorOf: function(successor) {
    this.resetSuccessor();
    this.set('successor', successor);
    successor.get('predecessors').add(this);
  },

  removeSuccessorLink: function () {
    if (this.group() && this.group() === this.successor().group()) {
      this.group().splitAfter(this);
    }
    this.resetSuccessor();
  },

  _collectionChanged: function (sourceEvent, item) {
    if (!this.collectionChanging) {
      this.collectionChanging = true;
      this.trigger('change', sourceEvent, item, this);
      this.collectionChanging = false;
    }
  }
});

var PageCollection = Backbone.Collection.extend({
  model: Page
});
