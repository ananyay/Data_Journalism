// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
var chosenXAxis = "poverty";
var chosenYaxis = "healthcare"

// Import Data
var file = "assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw err;
}

function successHandle(healthdata) {
  console.log(healthdata)
  healthdata.forEach(function(data){
    data.state = +data.state
    data.abbr = +data.abbr
    data.poverty = +data.poverty
    data.povertyMoe = +data.povertyMoe    
    data.state = +data.state
    data.income = +data.income
    data.healthcare = +data.healthcare
    data.healthcareLow = +data.healthcareLow
    data.healthcareHigh = +data.healthcareHigh
    
  })

  // Step 2: Create scale functions
  // ==============================

  // x function
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthdata, d=>d[chosenXAxis])*0.9,
      d3.max(healthdata, d => d[chosenXAxis])*1.1])
  .range([0,chartWidth]);

  // y function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthdata, d => d[chosenYaxis])*1.1])
    .range([chartHeight, 0]);

  // set bottom/left axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // x axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .style("font-size", "16px")
    .call(bottomAxis);

  // y axis
  chartGroup.append("g")
    .style("font-size", "16px")
    .call(leftAxis);

  // function for circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthdata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 12)
  .attr("fill", "blue")

  chartGroup.selectAll("text-circles")
  .data(healthdata)
  .enter()
  .append("text")
  .classed("text-circles",true)
  .text(d => d.abbr)
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .attr("dy",5)
  .attr("text-anchor","middle")
  .attr("font-size","12px")
  .attr("fill", "white");

  // Initialize tool tip
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
  return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.healthcare}% `);
  });

  // Create tooltip in the chart  
  chartGroup.call(toolTip);
  //  Create event listeners to display and hide the tooltip
  // onmouseover event
  circlesGroup.on("mouseover", function(data) {
  toolTip.show(data, this)
  })

  // onmouseout event
  .on("mouseout", function(data, index) {
  toolTip.hide(data)
  });


  // y axis
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left -5)
  .attr("x", 0 - (chartHeight/ 2))
  .attr("dy", "1em")
  .classed("aText", true)
  .text("Lacks Healthcare (%)");

  // x axis
  chartGroup.append("text")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 15})`)
  .attr("dy", "1em")
  .classed("aText", true)
  .text("Poverty Rate (%)");

}
