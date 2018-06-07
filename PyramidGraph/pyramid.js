// SET UP DIMENSIONS
var w = 1200,
  h = 300;

// margin.middle is distance from center line to each y-axis
var margin = {
  top: 20,
  right: 124,
  bottom: 30,
  left: 195,
  middle: 28
};


// the width of each side of the chart
// <-regionWidth-><-middle-><-middle-><-regionWidth->
var regionWidth = w / 2 - margin.middle;

// these are the x-coordinates of the y-axes
var pointA = regionWidth; //left
var  pointB = w - regionWidth; //right

// svg transform string
function translation(x, y) {
  return 'translate(' + x + ',' + y + ')';
}

var categories;
var yScale;
var xScale;

d3.csv('./food.csv', function(data) {
  // Group databy year
  d3.select(".chart")
    .append('p')
    .html('Diet Recommended Servings')
    .style('text-align', 'center');
    
  var chart = d3.select(".chart")
    .append('svg')
    .attr("height", h)
    .attr("width", w)
    .style('margin', 'auto')
    .style('display', 'block')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

  var maxValue = Math.max(
    d3.max(data, function(d) {
      return +d.serving;
    }),
    d3.max(data, function(d) {
      return +d.serving;
    })
  );
  
  xScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, regionWidth -9])
    .nice();
    

  yScale = d3.scale.ordinal()
    .domain(data.map(function(d) {
      return d.category;
    }))
    .rangeRoundBands([h - margin.bottom, 0], 0.1);


  var yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4, 0)
    .tickPadding(margin.middle)
    ;

  var yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4, 0)
    .tickFormat('');

  var xAxisRight = d3.svg.axis()
    .scale(xScale)
    .tickValues([1,2,3,4,5,6,7,8])
    .tickSize(4, 1)
    .tickFormat(d3.format(''));

  var xAxisLeft = d3.svg.axis()
    .scale(xScale.copy().range([pointA, 8]))
    .tickValues([1,2,3,4,5,6,7,8])
    .tickSize(4, 1)
    .tickFormat(d3.format(''));

  var svg = d3.select('svg');
  // MAKE GROUPS FOR EACH SIDE OF CHART
  // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
  var leftBarGroup = svg.append('g').attr('class', 'leftBarGroup')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
  var rightBarGroup = svg.append('g').attr('class', 'rightBarGroup')
    .attr('transform', translation(pointB, 0));
    
//USDA
    var leftUSDAGroup = svg.append('g').attr('class', 'leftUSDAGroup')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
      var rightUSDAGroup = svg.append('g').attr('class', 'rightUSDAGroup')
    .attr('transform', translation(pointB, 0));

  
  // ADD MARKS
  svg.append('text')
    .text('Diet 1 (Vegan)')
    .style('text-anchor', 'middle')
    .attr('transform', translation(w/10, h/10));
  svg.append('text')
    .text('Diet 2 (Paleo)')
    .style('text-anchor', 'middle')
    .attr('transform', translation(w-w/10, h/10));


  // DRAW AXES
  svg.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle');

  svg.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight);

  svg.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, h-margin.bottom))
    .call(xAxisLeft);

  svg.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(pointB, h-margin.bottom))
    .call(xAxisRight);

// DRAW THE BARS
    var leftUSDABar = d3.select('.leftUSDAGroup').selectAll('rectUSDA').data(data.filter(function(d) {return d.diet =="USDA";}));
    var rightUSDABar = d3.select('.rightUSDAGroup').selectAll('rectUSDA').data(data.filter(function(d) {return d.diet =="USDA";}));
    
    var leftBars = d3.select('.leftBarGroup').selectAll('rect').data(data.filter(function(d) {return d.diet =="Vegan";}));
    var rightBars = d3.select('.rightBarGroup').selectAll('rect').data(data.filter(function(d) {return d.diet =="Paleo";}));
    
    rightBars.enter().append('rect')
        .attr('class', 'enter')
        .attr('x',0)
        .attr('height', yScale.rangeBand())
        .attr('y', function(d) { return yScale(d.category); })
        .attr("width", function(d) { return xScale(d.serving); });

     leftBars.enter().append('rect')
        .attr('class', 'enter')
        .attr('x',0)
        .attr('height', yScale.rangeBand())
        .attr('y', function(d) { return yScale(d.category); })
        .attr("width", function(d) { return xScale(d.serving); });
    
    // USDA BARS
    leftUSDABar.enter().append('rect')
        .attr('class', 'enter')
        .attr('class', 'rectUSDA')
        .attr("style", "outline: 3px solid #51387d;") 
        .attr('x',0)
        .attr('height', yScale.rangeBand())
        .attr('y', function(d) { return yScale(d.category); })
        .attr("width", function(d) { return xScale(d.serving); });
    
     rightUSDABar.enter().append('rect')
        .attr('class', 'enter')
        .attr('class', 'rectUSDA')
        .attr("style", "outline: 3px solid #51387d;") 
        .attr('x',0)
        .attr('height', yScale.rangeBand())
        .attr('y', function(d) { return yScale(d.category); })
        .attr("width", function(d) { return xScale(d.serving); });

   });





