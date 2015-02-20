pageflow.sitemap.Selection = Backbone.Model.extend({
  defaults: function() {
    return {
      pages: [],
      chapters: [],
      pageLinks: []
    };
  },

  contains: function(model) {
    return _(this.get('chapters')).contains(model) ||
      _(this.get('pages')).contains(model) ||
      _(this.get('pageLinks')).contains(model);
  },

  select: function(name, models, options) {
    options = options || {};

    var base = options.additive ? this.get(name) : [];
    var attributes = this.defaults();

    attributes[name] = base.concat(models);
    this.set(attributes);

    this.trigger('select:' + name, attributes[name]);
  }
});