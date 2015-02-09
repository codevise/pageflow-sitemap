sitemap.ViewModel = function(entry, selection, options) {
  options = options || {};

  var nodes = this.nodes = [];
  var links = this.links = [];
  var groups = this.groups = [];
  var followLinks = this.followLinks  = [];
  var successorLinks = this.successorLinks = [];
  var placeholders = this.placeholders = [];
  var size = this.size = {x: 0, y: 0};

  var nodesByName = {};

  var laneWidth = 2 * sitemap.settings.page.horizontalMargin + sitemap.settings.page.width,
      rowHeight = 2 * sitemap.settings.page.verticalMargin + sitemap.settings.page.height;

  var laneLengths = [];

  function ChapterWithPosition(chapter) {
    this.lane = function() {
      return chapter.configuration.get('lane') || 0;
    };

    this.row = function() {
      return chapter.configuration.get('row') || 0;
    };
  }

  entry.chapters.each(function(c) {
    var chapter = new ChapterWithPosition(c);

    var x = c.lane() * laneWidth;

    var chapterNodes = [];
    var groupSelected = _(selection.get('chapters')).contains(chapter);
    var groupDx = groupSelected ? options.groupDx || 0 : 0;
    var groupDy = groupSelected ? options.groupDy || 0 : 0;

    chapter.pages.each(function(page) {
      var rowIndex = chapter.row();

      var id = "page:" + page.cid;

      var ids = 0,
          knobs = [];

      var node = {
        id: id,
        page: page,
        chapter: chapter,
        x0: typeof page.x0 == "undefined" ? x : page.x0,
        y0: typeof page.y0 == "undefined" ? (rowIndex-1 ) * rowHeight : page.y0,
        x: x + groupDx,
        y: (rowIndex++) * rowHeight + groupDy,
        availKnobs: options.hideKnobs ? [] : knobs,
        visibleKnobs: []
      };

      chapterNodes.push(node);
      nodes.push(node);

        // build index of nodes by name
      nodesByName[page.cid] = node;
    });

    var lastNode = _.last(chapterNodes);

    //if (!group.successor() && lastNode) {
    lastNode.successor = {
      id: 'group:successor:' + chapter.cid,
      pid: lastNode.id,
      group: chapter,
      node: lastNode
    };
    //  }

    groups.push({
      id: 'group:' + chapter.cid,
      group: chapter,
      nodes: chapterNodes,
      selected: groupSelected,
      dragged: groupSelected && ('groupDx' in options),
      x: x + groupDx,
      y: group.row() * rowHeight + groupDy,
      height: chapter.pages.length * rowHeight - 2 * sitemap.settings.page.verticalMargin
    });

    laneLengths[laneIndex] = rowIndex;
  });

  // parse links
  nodes.forEach(function(node) {
    var knobs = node.page.get('knobs');
    knobs.forEach(function(knob) {
      knob.pageLinks.forEach(function (link) {
        if (link.targetPage()) {
          var pageName = link.targetPage().cid;

          if (!(nodesByName[pageName])) {
            throw('node not found for ' + pageName);
          }

          links.push({
            id: "link:" + node.page.name() + '-' + pageName,
            link: link,
            source: node,
            target: nodesByName[pageName]
          });
        }
      });
    });
  });

  var maxLaneLength = Math.max.apply(null, laneLengths);

  // parse follower links
  data.get('lanes').forEach(function(groups, laneIndex){
    groups.forEach(function(group) {
      var last = false;
      group.get('pages').forEach(function(page) {
        var pageName = page.name();
        var target = nodesByName[pageName];

        if (last && target) {
          followLinks.push({
            id: "follow:" + nodesByName[last].page.name() + '-' + pageName,
            source: nodesByName[last],
            target: target
          });
        }
        last = pageName;
      });

      if (group.successor()) {
        var targetName = group.successor().name(),
            source = nodesByName[last],
            target = nodesByName[targetName];

        if (source && target) {
          successorLinks.push({
            id: "successor:" + last + '-' + targetName,
            source: source,
            target: target
          });
        }
      }
    });

    // create placeholders below
    var i;
    for(i = laneLengths[laneIndex]; i <= maxLaneLength; i++) {
      placeholders.push({
        id: "placeholder:" + laneIndex + ':' + i,
        lane: groups,
        row: i,
        x: laneIndex * laneWidth,
        y: i * rowHeight
      });

      size.x = Math.max(size.x, laneIndex * laneWidth);
      size.y = Math.max(size.y, i * rowHeight);
    }
  });
};
