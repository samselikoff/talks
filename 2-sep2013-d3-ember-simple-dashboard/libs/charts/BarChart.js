function BarChart() {

    var margin           = {top: 40, right: 20, bottom: 40, left: 60},
        xScale           = d3.scale.ordinal(),
        yScale           = d3.scale.linear(),
        xAxis            = d3.svg.axis().scale(xScale).orient("bottom"),
        yAxis            = d3.svg.axis().scale(yScale).orient("left"),
        color            = d3.scale.category10(),
        duration         = 500,
        oneColor         = false,
        manyColors       = false,
        rotateAxisLabels = false,
        hideAxisLabels   = false,
        hideDataLabels   = false,
        staticDataLabels = false,
        hoverDataLabels  = 'top',
        fadeOnHover      = true,
        noTicks          = false,
        emptyText        = 'No data.';


    function chart(selection) {
        selection.each(function(data)
        {
            var width = selection[0][0].offsetWidth-margin.left-margin.right;
            var height = selection[0][0].offsetHeight-margin.top-margin.bottom;

            if (noTicks) {
                xAxis.tickFormat("");
            }

            data.forEach(function(d) {
                d.count = +d.count;
            });

            // debugger;
            var empty = !data.some(function(d) {
                return (d.count !== 0 && !isNaN(d.count));
            });
            // debugger;

            if (empty) {
                var _this = this;

                // Select the message svg element, if it exists.

                var setMsg = function() {
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
                        .text(function() {return emptyText || 'No data to show.'; });
                };

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

            // Update the x-scale.
            xScale
                .rangeRoundBands([0, width], 0.1)
                .domain(data.map(function(d) { return d.category; }));

            // Update the y-scale.
            yScale
                .range([height, 0])
                .domain([
                    d3.min(data, function(d) { return d3.min([d.count, 0]); }),
                    d3.max(data, function(d) { return d.count; })
                ]);

            // Select the svg element, if it exists.
            var svg = selection.selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("g")
                .attr("class", "x axis")
                .call(xAxis);
            gEnter.append("g").attr("class", "y axis").call(yAxis);

            // Update the outer dimensions.
            svg.attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom);

            // Update the inner dimensions.
            var g = svg.select("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the x-axis.
            g.select(".x.axis")
                .attr("transform", "translate(0, "+yScale(0)+")") // transform to 0 baseline (in case of neg values)
                .transition()
                .duration(duration)
                .call(xAxis);

            if (rotateAxisLabels) {
                svg.selectAll(".x.axis text")
                    .attr("transform", "rotate(-45)translate(-9, -7)")
                    .style("text-anchor", "end");
            }

            if (hideAxisLabels) {
                svg.selectAll(".x.axis text")
                    .style("opacity", "0");
            }

            // Update the y-axis.
            g.select(".y.axis")
                .transition()
                .duration(duration)
                .call(yAxis);

            // Update the bars.
            var bars = g.selectAll(".bar").data(function(d) {return d;});
            bars.enter()
                .append("rect").attr("class", "bar").attr("height", 0).attr("y", yScale(0));
            bars // update
                .attr("fill", function(d) {
                    if (oneColor) {
                        return oneColor;
                    } else if (manyColors) {
                        return color(d.category);
                    } else {
                        return (d.count >= 0)
                            ? '#1f77b4'
                            : '#BB1A03';
                    }
                })
                .transition()
                .duration(duration)
                .attr("x", function(d) { return xScale(d.category); })
                .attr("width", xScale.rangeBand())
                .attr("y", function(d) { return yScale(d3.max([0, d.count])); })
                .attr("height", function(d) { return Math.abs(yScale(d.count) - yScale(0)); });
            bars.exit()
                .transition()
                .duration(duration)
                .attr("y", height)
                .attr("height", 0)
                .remove();

            // Static data labels
            if (staticDataLabels) {
                gEnter.append("g").attr("class", "dataLabels");
                var dataLabels = g.select(".dataLabels")
                        .selectAll(".dataLabel")
                        .data(function(d) {return d;});

                var dataLabelsEnter = dataLabels.enter()
                    .append("g")
                    .attr("class", "dataLabel")
                    .attr("transform", function(d, i) { return "translate("+ (xScale(d.category) + (xScale.rangeBand() / 2)) +","+(yScale(0) - 30)+")"; });

                dataLabelsEnter.append("text")
                        .attr("class", "category")
                        .attr("text-anchor", "middle")
                        .style("font-weight", function(d, i) {
                            return (d.category == 'Total')
                                ? 'bold'
                                : 'normal';
                        })
                        .text(function(d) {return d.category;});

                dataLabelsEnter.append("text")
                    .attr("class", "value")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(0,20)")
                    .style("font-weight", "bold")
                    .style("fill", function(d, i) {
                        return (oneColor)
                            ? oneColor : (d.count >= 0)
                            ? '#1f77b4'
                            : '#BB1A03';
                    })
                    .text(function(d) {
                        var accounting = d3.format(",");
                        return (d.count >= 0)
                            ? '+$' + accounting(d.count)
                            : '-$' + accounting(-d.count);
                    });

                dataLabels
                    .transition()
                    .duration(duration)
                    .attr("transform", function(d, i) {return "translate("+ (xScale(d.category) + (xScale.rangeBand() / 2)) +","+( yScale(d3.max([d.count,0])) - 30)+")"; });
                dataLabels
                    .select(".category")
                    .text(function(d) {return d.category;});
                dataLabels
                    .select(".value")
                    .transition()
                    .duration(duration)
                    .tween("text", function(d) {
                        var i = d3.interpolate(this.textContent.replace("+", "").replace("$", ""), d.count);
                        var accounting = d3.format(",");
                        return function(t) {
                            this.textContent = (i(t) >= 0)
                                ? '+$' + accounting(Math.round(i(t)))
                                : '-$' + accounting(-Math.round(i(t)));
                        };
                    });
                dataLabels.exit()
                    .transition()
                    .duration(duration)
                    .attr("transform", function(d, i) {
                        var xTrans = /\(-?(\d)+.?(\d)+\,/.exec(d3.select(this).attr("transform"))[0].replace("(","").replace(",","");
                        return "translate("+ xTrans +","+yScale(0)+")"; })
                    .style("opacity", 0)
                    .remove();
            }

            // Hover labels
            if (hoverDataLabels && !hideDataLabels ) {

                // Select the container, if it exists.
                var hoverLabel = selection.selectAll(".hover-label").data([data]);

                // Otherwise, create the container
                var hoverLabelEnter = hoverLabel.enter().append("div").attr("class", "hover-label top");
                hoverLabelEnter.append("div").attr("class", "arrow");
                hoverLabelEnter.append("div").attr("class", "hover-label-content");

                hoverLabel.style('display', 'none');
                selection
                    .selectAll(".bar")
                    .on("mouseover.labels", function() { hoverLabel.style("display", "initial"); })
                    .on("mouseout.labels", function() { hoverLabel.style("display", "none"); })
                    .on("mousemove.labels", function(d, i) {
                        hoverLabel.select(".hover-label-content")
                            .html("<p>" + data[i].category + " : <strong>" + data[i].count + "</strong></p>");

                        var $hoverLabel = hoverLabel[0][0],
                            $object = d3.select(this)[0][0],
                            pos = $object.getBoundingClientRect(),
                            top = pos.top - $hoverLabel.offsetHeight - 6,
                            left = pos.left - ($hoverLabel.offsetWidth / 2) + (pos.width / 2);


                        hoverLabel.style("left", left+"px");
                        hoverLabel.style("top", top+"px");

                    });
            }

            if (fadeOnHover) {
                selection.selectAll(".bar")
                    .on("mouseout.fade", function() {
                        selection.selectAll(".bar").style("opacity", "1");
                    })
                    .on("mouseover.fade", function(d, i) {
                        selection.selectAll(".bar").filter(function(d, j){return i!=j;})
                            .style("opacity", ".5");
                        selection.selectAll(".bar").filter(function(d, j){return i==j;})
                            .style("opacity", "1");
                    });
            }
        });
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.margin.bottom = function(_) {
        if (!arguments.length) return margin.bottom;
        margin.bottom = _;
        return chart;
    };

    chart.xAxisTickValues = function(_) {
        if (!arguments.length) return xAxis.tickValues();
        xAxis.tickValues(_);
        return chart;
    };

    chart.oneColor = function(_) {
        if (!arguments.length) return oneColor;
        oneColor = _;
        return chart;
    };

    chart.rotateAxisLabels = function(_) {
        if (!arguments.length) return rotateAxisLabels;
        rotateAxisLabels = _;
        return chart;
    };

    chart.hideAxisLabels = function(_) {
        if (!arguments.length) return hideAxisLabels;
        hideAxisLabels = _;
        return chart;
    };

    chart.hideDataLabels = function(_) {
        if (!arguments.length) return hideDataLabels;
        hideDataLabels = _;
        return chart;
    };

    chart.hoverDataLabels = function(_) {
        if (!arguments.length) return hoverDataLabels;
        hoverDataLabels = _;
        return chart;
    };

    chart.staticDataLabels = function(_) {
        if (!arguments.length) return staticDataLabels;
        staticDataLabels = _;
        return chart;
    };

    chart.duration = function(_) {
        if (!arguments.length) return duration;
        duration = _;
        return chart;
    };

    chart.emptyText = function(_) {
        if (!arguments.length) return emptyText;
        emptyText = _;
        return chart;
    };

    chart.fadeOnHover = function(_) {
        if (!arguments.length) return fadeOnHover;
        fadeOnHover = _;
        return chart;
    };

    chart.manyColors = function(_) {
        if (!arguments.length) return manyColors;
        manyColors = _;
        return chart;
    };    

    chart.colors = function(_) {
        if (!arguments.length) return color.range();
        color.range(_);
        return chart;
    }; 

    chart.noTicks = function(_) {
        if (!arguments.length) {
            if ( xAxis.tickSize() === 0 ) {
                return true;
            } else {
                return false;
            }
        }

        if (_ === true) {
            xAxis.tickSize(0);
        } else {
            xAxis.tickSize(1);
        }
        return chart;
    };

    return chart;
}