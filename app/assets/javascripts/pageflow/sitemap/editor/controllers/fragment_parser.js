pageflow.sitemap.FragmentParser = pageflow.Object.extend({
  patterns: {
    storylines: /^\/?storylines\/(\d+)/,
    chapters: /^\/?chapters\/(\d+)/,
    pages: /^\/?pages\/(\d+)/
  },

  initialize: function(entry, fragment) {
    this.entry = entry;
    this.fragment = fragment;
  },

  select: function(selection) {
    _(this.patterns).any(function(pattern, name) {
      var model = this.getModel(name);

      if (model) {
        selection.select(name, model);
        return true;
      }
    }, this);
  },

  getModel: function(name) {
    var match = this.fragment.match(this.patterns[name]);

    if (match) {
      return this.entry[name].get(match[1]);
    }
  }
});