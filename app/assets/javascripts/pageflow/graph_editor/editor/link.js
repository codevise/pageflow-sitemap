/*global Backbone */
/*exported LinkCollection */

var Link = Backbone.Model.extend({
  initialize: function () {
    this.get('knob').get('links').add(this);
    this.get('target').get('incommingLinks').add(this);
  },

  remove: function () {
    this.get('knob').get('links').remove(this);
    this.get('target').get('incommingLinks').remove(this);
  }
});

var LinkCollection = Backbone.Collection.extend({
  model: Link
});
