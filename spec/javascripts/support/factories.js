support.factories = {
  entry: function(attributes) {
    var entry = new Backbone.Model(attributes);

    entry.storylines = new pageflow.StorylinesCollection();
    entry.chapters = new pageflow.ChaptersCollection();
    entry.pages = new pageflow.PagesCollection();

    return entry;
  },

  storyline: function(entry, attributes) {
    entry = entry || this.entry();

    attributes = attributes || {};
    attributes.id = _.uniqueId();

    var storyline = new Backbone.Model(_(attributes).omit('configuration'));

    storyline.configuration = new Backbone.Model(attributes.configuration);
    storyline.chapter = new pageflow.StorylineChaptersCollection({
      chapters: entry.chapters,
      storyline: storyline
    });

    entry.storylines.add(storyline);

    return storyline;
  },

  chapter: function(entry, storyline, attributes) {
    storyline = storyline || this.storyline();

    attributes = attributes || {};
    attributes.id = _.uniqueId();

    var chapter = new Backbone.Model(_(attributes).omit('configuration'));

    chapter.configuration = new Backbone.Model(attributes.configuration);
    chapter.pages = new pageflow.ChapterPagesCollection({
      pages: entry.pages,
      chapter: chapter
    });

    entry.chapters.add(chapter);

    return chapter;
  },

  page: function(chapter, attributes) {
    chapter = chapter || this.chapter();

    attributes = attributes || {};
    attributes.id = _.uniqueId();
    attributes.chapter_id = chapter.id;

    var page = new Backbone.Model(_(attributes).omit('configuration'));

    page.configuration = new Backbone.Model(attributes.configuration);
    page.pageLinks = function() {
      return support.factories.pageLinks();
    };
    page.chapterPosition = function() {
      return chapter.get('position');
    };

    chapter.pages.add(page);

    return page;
  },

  pageLinks: function() {
    var pageLinks = new Backbone.Collection();

    pageLinks.canAddLink = function() {
      return false;
    };

    return pageLinks;
  }
};