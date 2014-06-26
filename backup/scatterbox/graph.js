	
	var	width = 420;
	var	barHeight = 20;
	
	var x = d3.scale.linear()
		.range([0, width]);
		
	var chart = d3.select(".chart")
		.attr("width", width);
		
	
	d3.tsv("data.tsv", type, function(error, data) {
		x.domain([0, d3.max(data, function(d) {
			return d.value;
		})]);
		
		chart.attr("height", barHeight * data.length);
		
		var bar = chart.selectAll("g")// nao entendi esse g
			.data(data).enter().append("g")// nao entendi esse append
			.attr("transform", function(d, i) {
				return "translate(0," + i * barHeight + ")"; // ver funcion d, i
		});
		
		bar.append("rect")
		.attr("width", x)
		.attr("height", barHeight - 1);
		
		bar.append("text")
		.attr("x", function(d) {
			return x(d) - 3;
		})
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d) {
			return d;
		});	
		
	});
	
	function type(d) {
		d.value = d+d.value;
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

