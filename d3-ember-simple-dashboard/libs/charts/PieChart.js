function PieChart() {

    var margin      = {top: 20, right: 20, bottom: 20, left: 20},
        beginDate   = '',
        endDate     = '',
        color       = d3.scale.category10(),
        oneColor    = '',
        labelSize   = '',
        labelColor  = '',
        labelText   = '',
        customLabelEnter = '',
        customLabelUpdate = '',
        emptyText   = 'Empty!',
        showLegend      = false,
        straightenLabels = false,
        sliceClasses = '',
        duration = 500;

    function chart(selection) {
      selection.each(function(data)
      {
        var width = $(selection[0]).width()-margin.left-margin.right;
        var height = $(selection[0]).height()-margin.top-margin.bottom;
  
        
          
        if (showLegend) {
            radius = (Math.min(width, (height-(24 * data.length))) / 2 );
        } else {
            radius = (Math.min(width, height) / 2 );
        }
        
        arc = d3.svg.arc().outerRadius(radius).innerRadius(radius / 2);
  
        data.forEach(function(d) {
            d.count = +d.count;
        });
  
        var empty = 1;
  
        data.forEach(function(d) {
            if (d.count !== 0) {empty = 0;}
        });

        if (empty) {
            var _this = this;
    
            // Select the message svg element, if it exists.
    
            function setMsg() {
                var msg = d3.select(_this).selectAll(".message").data([data]);
                msg.enter()
                    .append("div")
                    .style('padding-top', (height/2)+'px')
                    .style('text-align', 'center')
                    .attr('class', 'message')
                    .append('text');
                msg.select('text')
                    .attr("transform", function() {return 'translate('+width/2+', '+height/2+')';})
                    .transition()
                    .duration(100)
                    .text(emptyText);
            }
    
            if (d3.select(_this).select("path")[0][0]) {
                d3.select(_this)
                    .selectAll("svg")
                    .transition()
                    .duration(200)
                    .style('opacity', 0)
                    .each('end', function(d) { 
                      setMsg();      
                    })
                    .remove();
            } else {
                setMsg();
            }
            return;
  
        } else {
            d3.select(this)
                .select('.message')
                .remove();
        }
  
        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.count; });
  
        if (oneColor) {
            var newColors = [];
            for (var i = 0; i < data.length; i++) {
                var percent = 40*i;
                newColors.push(shadeColor(oneColor, percent));
            }
            color.range(newColors);
        }
  
        // Select the svg element, if it exists.
        var svg = d3.select(this).selectAll("svg").data([pie(data)]);
  
        // Otherwise, create the skeletal chart.
        var gEnter = svg.enter().append("svg").append("g");
        for (var i = data.length - 1; i >= 0; i--) {
            var piece = gEnter.append("g").attr("class", "arc");
            piece.append("path").style("opacity", 0);
            piece.append("g").attr("class", "label").append("text").style("opacity", 0);
        }
        gEnter.selectAll("path")
            .data(function(d) {return d;})
            .style("fill", function(d) { return color(d.data.category); })
            .attr("class", function(d, i) {return (sliceClasses) ? sliceClasses[i] : '';})
            .each(function(d) { this._current = d; });
        gEnter.selectAll(".label")
            .data(function(d) {return d;})
            .attr("transform", function(d) { 
                var c = arc.centroid(d);
                return "rotate(" + angle(d) + "," + arc.centroid(d) + ")translate(" + c[0]*1.1 + "," + c[1]*1.1 + ")"; 
            });
        if (customLabelEnter) {
            customLabelEnter.forEach(function(statement) {
                eval('gEnter.selectAll(".label").select("text")'+statement);
            });
        } else {
            gEnter.selectAll(".label")
                .select("text")
                .text(function(d) {
                    if (d.data.count === 0) {return '';}
                    return (labelText)
                        ? eval(labelText)
                        : d.data.category; 
                });
        }


        // Update the outer dimensions.
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
  
        // Update the inner dimensions.
        var g = svg.select("g")
            .attr("transform", "translate(" + ( ( width / 2 ) + margin.left ) + "," + ( ( radius ) + margin.top )+ ")");
  
        // Update the arcs.
        g.selectAll("path")
            .data(function(d) {return d;})
            .transition()
            .duration(duration)
            .style("opacity", 1)
            .attrTween("d", arcTween);
  
        // Update the labels.
        var labels = g.selectAll(".label")
            .data(function(d) {return d;}).transition()
            .duration(duration)
            .attr("transform", function(d) {
                var c = arc.centroid(d);
                return "rotate(" + angle(d) + "," + arc.centroid(d) + ")translate(" + c + ")"; 
            })
            .select("text")
            // .data(function(d) {return d;})
            .style("opacity", function(d) {
                return (d.data.count === 0)
                    ? 0
                    : 1;
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle");

        // if (customLabelUpdate) {
        //     customLabelUpdate.forEach(function(statement) {
        //         eval('labels'+statement);
        //     });

        // } else {
        //     labels.tween("text", function(d) {
        //         if (labelText) {
        //             return function(t) {
        //                 this.textContent = eval(labelText);
        //             };

        //         } else {
        //             var text = (labelText) ? eval(labelText) : d.data.category,
        //                 i = d3.interpolate(this.textContent.replace(",", ""), d.value);

        //             return function(t) {
        //               this.textContent = Math.round(i(t));
        //             };
        //         }
        //     });
        // }

        if (straightenLabels) {
            labels.attr("transform", function (d) { return "rotate(" + (-1 * angle(d)) + ")"; });
        }
  
        
        if (showLegend) {
            var legend = g.selectAll(".legend")
                .data(color.domain().slice())
            .enter().append("g")
                .attr("class", "legend");

            // Update position
            g.selectAll(".legend").attr("transform", function(d, i) { return "translate( "+-radius+" , " + ((radius) + 30 + (i*20)) + ")"; });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color)
                .style('opacity', 0)
                .transition()
                .duration(duration)
                .style('opacity', 1);

            legend.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                // .style('font-size', '13px')
                .style('fill', '#333')
                .style('opacity', 0)
                .text(function(d) { return d; })
                .transition()
                .duration(duration)
                .style('opacity', 1);
        }
  
        if (labelSize) {labels.style("font-size", labelSize);}
        if (labelColor) {labels.attr("fill", labelColor);}
  
      });
    }
  
    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }
  
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
    }
  
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };
  
    chart.beginDate = function(_) {
        if (!arguments.length) return beginDate;
        beginDate = _;
        return chart;
    };
  
    chart.endDate = function(_) {
        if (!arguments.length) return endDate;
        endDate = _;
        return chart;
    };
    
    chart.color = function(_) {
        if (!arguments.length) return color;
        color.range(_);
        return chart;
    };
  
    chart.oneColor = function(_) {
        if (!arguments.length) return oneColor;
        oneColor = _;
        return chart;
    };
  
    chart.labelSize = function(_) {
        if (!arguments.length) return labelSize;
        labelSize = _;
        return chart;
    };
  
    chart.labelColor = function(_) {
        if (!arguments.length) return labelColor;
        labelColor = _;
        return chart;
    };
    
    chart.labelText = function(_) {
        if (!arguments.length) return labelText;
        labelText = _;
        return chart;
    };

    chart.customLabelEnter = function(_) {
        if (!arguments.length) return customLabelEnter;
        customLabelEnter = _;
        return chart;
    };

    chart.customLabelUpdate = function(_) {
        if (!arguments.length) return customLabelUpdate;
        customLabelUpdate = _;
        return chart;
    };
    
    chart.showLegend = function(_) {
        if (!arguments.length) return showLegend;
        showLegend = _;
        return chart;
    };
  
    chart.emptyText = function(_) {
        if (!arguments.length) return emptyText;
        emptyText = _;
        return chart;
    };
  
    chart.straightenLabels = function(_) {
        if (!arguments.length) return straightenLabels;
        straightenLabels = _;
        return chart;
    };

    chart.sliceClasses = function(_) {
        if (!arguments.length) return sliceClasses;
        sliceClasses = _;
        return chart;
    };

    chart.duration = function(_) {
        if (!arguments.length) return duration;
        duration = _;
        return chart;
    };
  
    function shadeColor(color, percent) {
        var R = parseInt(color.substring(1,3),16)
        var G = parseInt(color.substring(3,5),16)
        var B = parseInt(color.substring(5,7),16);
  
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
  
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
  
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  
        return "#"+RR+GG+BB;
    }
  
    return chart;
}