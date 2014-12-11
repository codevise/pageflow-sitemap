/*global Backbone, Page, _, PageCollection*/
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

    newPage.removeFromGroup();

    this.get('pages').add(newPage, {at: index});

    if(atPosition) {
      newPage.makePredecessorOf(atPosition);
    }

    newPage.set('group', this);
  },

  removePage: function(page) {
    this.get('pages').remove(page);
    page.set('group', null);
  },

  removeFromLane: function () {
    if(this.collection) {
      this.collection.remove(this);
    }
  },

  makePredecessorOf: function (successor) {
    this.get('pages').last().makePredecessorOf(successor);
  },

  splitAfter: function (page) {
    var pages = this.get('pages');
    if (pages.last() !== page) {
      var group = new Group();

      _.forEach(pages.slice(pages.indexOf(page) + 1), function (page) {
        group.pushPage(page);
      });

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

Group.createGroup = function(data) {
  var pages = data.pages.map(function(p) {
    return new Page(p);
  });

  return new Group({
    pages: new PageCollection(pages),
    row: data.row
  });
};
