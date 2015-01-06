/*global _, options, graphEditor*/
graphEditor.Grid = function(data) {
  var nodes = this.nodes = [];
  var links = this.links = [];
  var groups = this.groups = [];
  var followLinks = this.followLinks  = [];
  var successorLinks = this.successorLinks = [];
  var nodesByName = {};
  var placeholders = this.placeholders = [];

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
        var id = "page:" + page.get('name');

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
          x: x,
          y: (rowIndex++) * rowHeight,
          availKnobs: knobs,
          visibleKnobs: []
        };

        groupNodes.push(node);
        nodes.push(node);

        // build index of nodes by name
        nodesByName[page.get('name')] = node;
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
        x: x,
        y: groupRow * rowHeight,
        height: (rowIndex - groupRow) * rowHeight - 2 * options.page.verticalMargin
      });
    });

    laneLengths[laneIndex] = rowIndex;
  });

  // parse links
  nodes.forEach(function(node) {
    var knobs = node.page.get('knobs');
    knobs.forEach(function(knob) {
      knob.get('links').forEach(function (link) {
        var pageName = link.get('target').get('name');
        links.push({
          id: "link:" + node.page.get('name') + '-' + pageName,
          link: link,
          source: node,
          target: nodesByName[pageName]
        });
      });
    });
  });

  var maxLaneLength = Math.max.apply(null, laneLengths);

  // parse follower links
  data.get('lanes').forEach(function(groups, laneIndex){
    groups.forEach(function(group) {
      var last = false;
      group.get('pages').forEach(function(page) {
        var pageName = page.get('name');
        var target = nodesByName[pageName];

        if (last && target) {
          followLinks.push({
            id: "follow:" + nodesByName[last].page.get('name') + '-' + pageName,
            source: nodesByName[last],
            target: target
          });
        }
        last = pageName;
      });

      if (group.successor()) {
        var targetName = group.successor().get('name'),
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
    }
  });
};
