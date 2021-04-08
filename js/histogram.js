
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// parse the date / time
const parseDate = d3.timeParse("%Y");

// set the ranges
var x_histograma = d3.scaleTime()
          .domain([new Date(1500, 0, 1), new Date(1850,0, 1)])
          .rangeRound([0, width]);
var y_histograma = d3.scaleLinear()
          .range([height, 0]);

// set the parameters for the histogram
var histogram = d3.histogram()
    .value(function(d) { return d.date; })
    .domain(x_histograma.domain())
    .thresholds(x_histograma.ticks(d3.timeYear));

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg_histograma = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.json("data/data.json").then((json) => {
        data = json;

       // format the data
  data.forEach(function(d) {
      d.date = parseDate(d.any);
  });

  // group the data for the bars
  var bins = histogram(data);

  // Scale the range of the data in the y domain
  y_histograma.domain([0, d3.max(bins, function(d) { return d.length; })]);

  // append the bar rectangles to the svg element
  svg_histograma.selectAll("rect")
      .data(bins)
      .enter().append("rect")
      .style("fill", "#69b3a2")
      .attr("x", 1)
      .attr("transform", function(d) {
      return "translate(" + x_histograma(d.x0) + "," + y_histograma(d.length) + ")"; })
      .transition()
      .duration(800)
      //.attr("width", function(d) { return width - x(d.length); }) 
      .attr("width", function(d) { return x_histograma(d.x1) - x_histograma(d.x0) ;  })
      .attr("height", function(d) { return height - y_histograma(d.length); });

  // add the x Axis
  svg_histograma.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_histograma));

  // add the y Axis
  svg_histograma.append("g")
      .call(d3.axisLeft(y_histograma));

  svg_histograma.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Total de cartes");

});