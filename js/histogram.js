var width = 1000,
    height = 400,
    pad = 20, 
    left_pad = 50;

var x = d3.scale.ordinal().rangeRoundBands([left_pad, width-pad], 0.1);
var y = d3.scale.linear().range([height-pad, pad]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json('data/data.json', function (data) {

        data = data.map(function (key) {
            var rObj = {};
            rObj[key.any] = key.total;
           return rObj;
       });



 x.domain(data.map(function(d) { return Object.keys(d); }));
  y.domain([0, d3.max(data, function(d) { return +d[Object.keys(d)]; })]);
  

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, "+(height-pad)+")")
        //.call(xAxis.tickValues([1550,1600,1650,1700,1750,1800]));
        .call(xAxis.tickValues(x.domain().filter(function(_, i) {
          return !(i % 10);
        })));

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate("+(left_pad-pad)+", 0)")
        .call(yAxis)
        .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Nombre de cartes");;

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) { return x(Object.keys(d)); })
        .attr('width', x.rangeBand())
        .attr('y', height-pad)
        .transition()
        .delay(function (d) { return Object.keys(d)*0.3; })
        .duration(800)
        .style("fill", "#69b3a2")
        .attr('y', function (d) { return y(+d[Object.keys(d)]); })
        .attr('height', function (d) { return height-pad - y(+d[Object.keys(d)]); });

});