		
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "%");
	
	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	d3.tsv("data.tsv", type, function(error, data) {
	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
	
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);
	
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Frequency");
	
	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.letter); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.frequency); })
	      .attr("height", function(d) { return height - y(d.frequency); });
	
	});
	
	function type(d) {
	  d.frequency = +d.frequency;
	  return d;
	}

	
	
	




/*.data(data)
.enter()
.append("div")
.style("width", function(d) {
return escala(d) + "px";
}).text(function(d) {
return d;
});
*/

//d3.select("body").append("div").html("helu, baby!");

/*
 d3.select("body")
 .append("svg")
 .attr("width", 200)
 .attr("height", 200)
 .append("circle")
 .attr("cx", 100)
 .attr("cy", 100)
 .attr("r", 50)
 .style("fill", "purple");

 <script src="d3/d3.v3.js" charset="utf-8"></script>
 <script src="d3/d3.min.js" charset="utf-8"></script>
 <script src="d3/d3.tip.js" charset="utf-8"></script>
 <script src="graph.js" charset="utf-8"></script>
 <link href="style.css" rel="stylesheet">

 */

