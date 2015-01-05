/*global Backbone, Page, _, PageCollection, pageflow, console*/
/*exported Group*/

var groupIdSeq = 0;

var Group = Backbone.Model.extend({
  initialize: function() {
    if (!this.get('pages')) {
      this.set('pages', new PageCollection());
    }

    this.set('id', groupIdSeq++);

    this._ensureState();
    this.get('pages').on('all', _.bind(this.trigger, this, 'change'));
  },

  chapter: function () {
    return this.get('chapter');
  },

  select: function() {
    var chapter = this.get('chapter'),
        id = chapter.get('id');

    pageflow.editor.navigate('/chapters/' + id, {trigger: true});
  },


  row: function(val) {
    return this.configuration('row', val);
  },

  lane: function(val) {
    return this.configuration('lane', val);
  },

  configuration: function(name, value) {
    if (name && !_.isUndefined(value)) {
      this.get('chapter').configuration.set(name, value);
    }

    if (name) {
      return this.get('chapter').configuration.get(name);
    }

    return this.get('chapter').configuration;
  },

  page: function (i) {
    return this.get('pages').at(i);
  },

  position: function () {
    var position;
    if (this.collection) {
      this.collection.forEachWithPosition(function (group, p) {
        if (group === this) {
          position = p;
        }
      }, this);
    }
    return position;
  },

  pushPage: function (newPage) {
    this.addPageAt(newPage);
  },

  addPageBefore: function(newPage, beforePage) {
    this.addPagesBefore([newPage], beforePage);
  },

  addPageAfter: function(newPage, afterPage) {
    this.addPagesAfter([newPage], afterPage);
  },

  addPagesBefore: function(pages, beforePage) {
    this.addPagesAt(pages, this.get('pages').indexOf(beforePage));
  },

  appendPages: function (pages) {
    this.addPagesAt(pages, this.count());
  },

  addPagesAfter: function(pages, afterPage) {
    this.addPagesAt(pages, this.get('pages').indexOf(afterPage) + 1);
  },

  addPagesAt: function(pages, index) {
    _.forEach(pages.map(function (page, offset) {
      return {page: page, position: index + offset};
    }), function (d) {
      this.addPageAt(d.page, d.position);
    }, this);
  },

  addPageAt: function(newPage, index) {
    var pages = this.get('pages');
    var atPosition = pages.at(index);

    var predecessor = atPosition ? atPosition.predecessorInGroup() :  pages.last();
    if (predecessor) {
      predecessor.makePredecessorOf(newPage);
    }

    // add to sitemap group
    this.get('pages').add(newPage, {at: index});

    if(atPosition) {
      newPage.makePredecessorOf(atPosition);
    }

    var oldGroup = newPage.group();
    newPage.set('group', this);

    // update the pageflow models.
    var chapter = this.get('chapter'),
        page = newPage.page();

    if (chapter.isNew()) {
      chapter.once('sync', function() {
        chapter.pages.saveOrder();
      }, this);
      chapter.pages.add(page, {at: index});
    }
    else {
      chapter.pages.add(page, {at: index});
      chapter.pages.saveOrder();
    }

    // remove from old group
    if (oldGroup) {
      oldGroup.get('pages').remove(newPage);
      if (oldGroup.collection) oldGroup.collection.removeEmptyGroups();
    }

    if (this.collection) this.collection.removeEmptyGroups();
  },

  removePage: function(page) {
    this.get('pages').remove(page);
    page.set('group', null);

    // update the pageflow model.
    var chapter = this.get('chapter');

    chapter.pages.remove(page.page());
  },

  removeFromLane: function () {
    if(this.collection) {
      this.collection.removeGroup(this);
    }
  },

  makePredecessorOf: function (successor) {
    this.get('pages').last().makePredecessorOf(successor);
  },

  splitAfter: function (page) {
    var pages = this.get('pages');
    if (pages.last() !== page) {
      var group = Group.createGroup();

      var splitIndex = pages.indexOf(page) + 1;

      // add pages after split page to new group
      _.forEach(pages.slice(splitIndex), function (page) {
        group.pushPage(page);
        this.removePage(page);
      }, this);
      // TODO: Save lane&row of new group

      this.collection.add(group);
    }
  },

  successor: function () {
    var page = this.get('pages').last();
    if (page)  {
      return page.get('successor');
    }
  },

  isEmpty: function() {
    return this.count() === 0;
  },

  count: function() {
    return this.get('pages').length;
  },

  joinWithIfConnected: function (group) {
    if (this.collection == group.collection &&
        this.successor() === group.get('pages').first() &&
        this.position().end === group.position().start) {
      this.appendPages(group.get('pages'));
      group.removeFromLane();
    }
  },

  _ensureState: function () {
    var last;
    this.get('pages').forEach(function(page) {
      page.set('group', this);

      if (last) {
        last.makePredecessorOf(page);
      }
      last = page;
    }, this);
  }
});

Group.createGroup = function(lane, row) {
  var chapter = pageflow.entry.addChapter({
    configuration: {
      lane: lane,
      row: row
    }
  });

  var group = new Group({
    chapter: chapter
  });

  return group;
};
