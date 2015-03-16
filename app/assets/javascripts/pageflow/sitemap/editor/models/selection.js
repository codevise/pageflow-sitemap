pageflow.sitemap.Selection = Backbone.Model.extend({
  defaults: function() {
    return {
      pages: [],
      chapters: [],
      pageLinks: [],
      successorLinks: []
    };
  },

  contains: function(model) {
    return _(this.get('chapters')).contains(model) ||
      _(this.get('pages')).contains(model) ||
      _(this.get('pageLinks')).some(function(link) {
        return link === model |
          (link.id && link.id === model.id) ||
          (link.placeholder && link.placeholder === model.placeholder);
      }) ||
      _(this.get('successorLinks')).some(function(link) {
        return link.successor && link.successor === model.successor;
      });
  },

  select: function(name, models, options) {
    options = options || {};

    var base = options.additive ? this.get(name) : [];
    var attributes = this.defaults();

    attributes[name] = base.concat(models);
    this.set(attributes);

    this.trigger('select:' + name, attributes[name]);
  },

  reset: function() {
    this.select('pages', []);
  }
});