/*global graphEditor, d3, options, console, _*/

(function() {
  graphEditor.pagesView = graphEditor.D3View(function(svg) {
    svg.update = function(node) {
      node
          .attr("transform", transformStart)
          .transition().duration(options.duration)
          .attr("transform", transformFinal);
    };

    svg.enter = function(node, opts) {
      var g = node.append("g")
          .attr("class", "node")
          .attr("id", function(d) { return 'node:'+ d.page.get('name'); })
          .attr("transform", transformStart);

      g.transition()
          .duration(window.options.duration)
          .attr("transform", transformFinal);
    };

    function transformStart(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; }
    function transformFinal(d) { return "translate(" + d.x + "," + d.y + ")"; }
  });

  graphEditor.pageView = graphEditor.D3View(function(svg) {
    svg.enter = function(node, opts) {
      var trX = -options.page.width / 2,
          trY = options.page.height / 2;

      var g = node.append("svg:g")
          .attr('class', "pageview")
          .attr("id", function(d) { return d.id; })
          .call(drag(opts))
          .on('mouseover', function(d) {
            d3.select(this).classed('hover', true);

            // highlight links
            d3.selectAll('[id^="link:' + d.page.get('name') +'"]').classed('highlight', true);
            d.page.get('incommingLinks').forEach(function(link) { // TODO this shouldn't be hardcoded here
              d3.selectAll('[id^="page:' + link +'"]').classed('highlight', true);
            });

            clearTimeout(d.page.menuTimeout);
            d3.select(this.parentNode).classed('show-menu', true);
          })
          .on('mouseout', function(d) {
            d3.select(this).classed('hover', false);
            d3.selectAll('.highlight').classed('highlight', false);

            d.page.menuTimeout = setTimeout(_.bind(function () {
              d3.select(this).classed('show-menu', false);
            }, this.parentNode), 200);
          })
      ;

      g.append('svg:rect')
          .attr('class', "page")
          .attr("width", options.page.width)
          .attr("height", options.page.height)
          .attr("transform", "translate(" + trX + "," + (-trY) + ")")
          .style("fill", "lightsteelblue")
          .on('click', function() {
            if (opts.click) {
              opts.click.apply(this, arguments);
            }
          })
      ;


      // thumbnail
      g.each(function(d) {
        var r = d3.select(this);
        var thumb = d.page.get('page').thumbnailFile();
        if (thumb) {
          r.append('image')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", options.page.width)
            .attr("height", options.page.height)
            .attr("transform", "translate(" + trX + "," + (-trY) + ")")
            .attr("xlink:href", thumb.get('thumbnail_url'))
            .on('click', function() {
              if (opts.click) {
                opts.click.apply(this, arguments);
              }
            })
          ;
        }
      });

      // panel behind title
      g.append('svg:rect')
          .attr("width", options.page.width-2)
          .attr("height", 12)
          .attr("transform", "translate(" + (trX+1) + "," + (-trY) + ")")
          .style("fill", "white")
        ;

      g.append("svg:g")
          .attr('class', 'drag-dummy')
          .append("svg:rect")
            .attr('height', options.page.height)
            .attr('width', options.page.width)
            .attr("transform", "translate(" + trX + "," + (-trY) + ")")
      ;


      g.append("foreignObject")
          .attr("width", options.page.width-2)
          .attr("height", 12)
          .attr("transform", "translate(" + (trX+1) + "," + (-trY) + ")")
        .append("xhtml:body")
          .html(pagetext)
      ;
    };

    svg.update = function(node) {
      node.select('.pageview div.pagetext')
          .html(pagetext)
      ;
    };

    function pagetext(d) { return '<div class="pagetext">'+ d.page.get('title') + '</div>'; }

    function drag(opts) {
      return graphEditor.addDrag('page-drag')
          .dummy(function () { return d3.select(this.parentNode).select('.drag-dummy'); })
          .dropTarget('area')
            .start(function () { this.style('pointer-events', 'all'); })
            .end(function () { this.style('pointer-events', 'none'); })
          .dropped(opts.droppedOnArea)
          .dropTarget('placeholder')
            .dropped(opts.droppedOnPlaceholder)
          .listener();
    }
  });

  graphEditor.dropAreaView = graphEditor.D3View(function(svg) {
    var trX = -options.page.width / 2,
    trY = -options.page.height / 2,
    verticalMargin = window.options.page.verticalMargin;

    svg.enter = function(node) {
      node.append('svg:rect')
          .attr("class", function(d) { return "area " + d.position; })
          .attr("width", window.options.page.width)
          .attr("height", verticalMargin + 5)
          .attr("transform", function(d) { return  "translate(" + trX + "," + d.dy  + ")"; })
          .on("mouseover.push", function(node) {
            d3.select(this).classed("hover", true);

            var moveY = trY;
            if (node.position == "before") {
              moveY += verticalMargin;
            }
            else {
              moveY -= verticalMargin;
            }
            // make page move
            var p = d3.select(this.parentElement).select(".page");
            p.attr("transform", "translate("+ trX +","+moveY+ ")");
          })
          .on('mouseout.push', function() {
            d3.select(this).classed('hover', false);
            // move page back to original position
            d3.select(this.parentElement).select(".page")
                .attr("transform", "translate(" + trX + "," + trY + ")");
          })
      ;
    };
  });
}());
