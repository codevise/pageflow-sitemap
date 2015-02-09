/*global _, options, sitemap*/
sitemap.Grid = function(data, selection, opts) {
  opts = opts || {};

  var nodes = this.nodes = [];
  var links = this.links = [];
  var groups = this.groups = [];
  var followLinks = this.followLinks  = [];
  var successorLinks = this.successorLinks = [];
  var nodesByName = {};
  var placeholders = this.placeholders = [];
  var size = this.size = {x: 0, y: 0};

  var laneWidth = 2 * options.page.horizontalMargin + options.page.width,
      rowHeight = 2 * options.page.verticalMargin + options.page.height;

  var laneLengths = [];
  // parse nodes
  data.get('lanes').forEach(function(lane, laneIndex){
    var rowIndex = 0;
    var x = laneIndex * laneWidth;
    lane.forEach(function(group) {
      var groupNodes = [];
      var groupRow = Math.max(group.row() ? group.row() : 0, rowIndex);

      var groupSelected = _(selection.get('groups')).contains(group);
      var groupDx = groupSelected ? opts.groupDx || 0 : 0;
      var groupDy = groupSelected ? opts.groupDy || 0 : 0;

      for(; rowIndex < groupRow; rowIndex++) {
        placeholders.push({
          id: "placeholder:" + laneIndex + ':' + rowIndex,
          lane: lane,
          row: rowIndex,
          x: x,
          y: rowIndex * rowHeight
        });
      }

      group.get('pages').forEach(function(page) {
        var id = "page:" + page.name();

        var ids = 0,
            knobs = page.get('knobs').map(function (knob) {
              return { pid: id, id: ids++, text: knob.get('name'), knob: knob };
            });

        var node = {
          id: id,
          page: page,
          group: group,
          x0: typeof page.x0 == "undefined" ? x : page.x0,
          y0: typeof page.y0 == "undefined" ? (rowIndex-1 ) * rowHeight : page.y0,
          x: x + groupDx,
          y: (rowIndex++) * rowHeight + groupDy,
          availKnobs: opts.hideKnobs ? [] : knobs,
          visibleKnobs: []
        };

        groupNodes.push(node);
        nodes.push(node);

        // build index of nodes by name
        nodesByName[page.name()] = node;
      });

      var lastNode = _.last(groupNodes);
      if (!group.successor() && lastNode) {
        lastNode.successor = {
          id: 'group:successor:' + group.get('id'),
          pid: lastNode.id,
          group: group,
          node: lastNode
        };
      }

      groups.push({
        id: 'group:' + group.get('id'),
        group: group,
        nodes: groupNodes,
        selected: groupSelected,
        dragged: groupSelected && ('groupDx' in opts),
        x: x + groupDx,
        y: groupRow * rowHeight + groupDy,
        height: (rowIndex - groupRow) * rowHeight - 2 * options.page.verticalMargin
      });
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
