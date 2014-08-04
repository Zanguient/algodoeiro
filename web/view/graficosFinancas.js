/**
 * Interessnte colocar aqui o papel do grafico, so pra fins de documentacao
 *
 */
function graficoReceita(div_selector, custos, data, regioes) {

	var dataAux = _.clone(data);
	labels = _.pluck(regioes, 'regiao');
	var yGroupMax = d3.max(_.pluck(dataAux, 'receita'));

	var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
		return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Receita:</strong> <span> R$ " + d.receita + " / ha </span> ";
	});

	var tipCusto = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
		return "<span>Região: " + d.nome_regiao + "</span> <br> <strong>Custo:</strong> <span> R$ " + d.total + " / ha </span> ";
	});

	var margin = {
		top : 20,
		right : 20,
		bottom : 30,
		left : 80
	}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom, padding = 1, // separation between nodes
	radius = 4;

	var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width], 1);
	var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis().scale(x).orient("bottom");

	var yAxis = d3.svg.axis().scale(y).orient("left");

	var svg = d3.select(div_selector).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	for(var i = 0; i < labels.length; i++){
		var agricultorDaRegiao = _.filter(data, function(d){ return d.nome_regiao == labels[i]; });
		var valoresDaReceitaDosAgricultores = _.pluck(agricultorDaRegiao, 'receita');
		var widthRect = tamanhoBoxPlot(width, labels.length);
		criaBoxPlot(valoresDaReceitaDosAgricultores, svg, y, x(labels[i]), widthRect);
	}

	svg.call(tip);
	svg.call(tipCusto);
	var xVar = "Receita (R$ / ha)", yVar = "Regiões";

	var force = d3.layout.force().nodes(dataAux).size([width, height]).on("tick", tick).charge(-1).gravity(0).chargeDistance(20);

	// Set initial positions
	dataAux.forEach(function(d) {
		d.x = x(d.nome_regiao);
		d.y = y(d.receita);
		d.color = color(d.nome_regiao);
		d.radius = radius;
	});

	svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text("Regiões");

	svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Receita ( R$ / ha)");

	criaLinhaDeCustos(custos);

	var node = svg.selectAll(".dot").data(dataAux).enter().append("circle").attr("class", "dot").attr("r", radius).attr("cx", function(d) {
		return x(d.nome_regiao);
	}).attr("cy", function(d) {
		return y(d.receita);
	}).style("fill", function(d) {
		return d.color;
	}).on('mouseover', tip.show).on('mouseout', tip.hide);

	colocaLegendaRegioes(color,svg, width);

	// d3.select("#collisiondetection").on("change", function() {
	//   force.resume();
	// });

	force.start();
	force.resume();


	function criaLinhaDeCustos(custos) {
		var layers_custos = _.values(custos);
		//Tamanhos e Quantidades
		var n = layers_custos.length, // number of layers
		m = layers_custos[0].length, // number of samples per layer
		yGroupMax = d3.max(layers_custos, function(layer) {
			return d3.max(layer, function(d) {
				return d.total;
			});
		});
		var widthRect = 142;
		//Dados
		var layer = svg.selectAll(".layer").data(layers_custos).enter().append("g").attr("class", "layer");

		var linhaCustos = layer.selectAll("rect").data(function(d) {
			return d;
		}).enter().append("rect").attr("x", function(d, i, j) {
			return x(d.nome_regiao) - widthRect / 2;
			//+ x.rangeBand() / n * j;
		}).attr("width", widthRect).attr("y", function(d) {
			return y(d.total);
		}).attr("height", function(d) {
			return 2;
		}).attr("class", function(d) {
			return d.nome_regiao;
		}).attr("fill", "red").on('mouseover', function(d) {
			tipCusto.show(d);
		}).on('mouseout', function(d) {
			tipCusto.hide(d);
		});
	}

	function tick(e) {
		node.each(moveTowardDataPosition(e.alpha));

		//if (checkbox.node().checked) node.each(collide(e.alpha));
		node.each(collide(e.alpha, dataAux, padding, radius));
		node.attr("cx", function(d) {
			return d.x;
		})
		;
		// .attr("cy", function(d) { return d.y; });
	}

	function moveTowardDataPosition(alpha) {
		return function(d) {
			d.x += (x(d.nome_regiao) - d.x) * 0.05 * alpha ;
			d.y += (y(d.receita) - d.y) * 0.1 * alpha;
		};
	}

}

/**
 * Interessnte colocar aqui o papel do grafico, so pra fins de documentacao
 *
 */
function graficoLucro(div_selector, data, regioes) {
	
	var dataAux = _.clone(data);
	labels = _.pluck(regioes, 'regiao');

	var yGroupMax = d3.max(_.pluck(dataAux, 'lucro'));
	var yGroupMin = d3.min(_.pluck(dataAux, 'lucro'));

	var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
		return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Lucro:</strong> <span> R$ " + d.lucro + " / ha </span> ";
	});

	var margin = {
		top : 20,
		right : 20,
		bottom : 30,
		left : 80
	}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom, padding = 1, // separation between nodes
	radius = 4;

	var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width], 1);

	var y = d3.scale.linear().domain([yGroupMin, yGroupMax]).range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat("");

	var yAxis = d3.svg.axis().scale(y).orient("left");

	var svg = d3.select(div_selector).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//criaBoxPlot(data, svg, "lucro", x, y, regioes, yGroupMin, yGroupMax, height);
	for(var i = 0; i < labels.length; i++){
		var agricultoresDaRegiao = _.filter(data, function(d){ return d.nome_regiao == labels[i]; });
		var valoresDosLucrosDosAgricultores = _.pluck(agricultoresDaRegiao, 'lucro');
		var widthRect = tamanhoBoxPlot(width, labels.length);
		criaBoxPlot(valoresDosLucrosDosAgricultores, svg, y, x(labels[i]),widthRect);
	}

	svg.call(tip);

	var xVar = "Lucro ( R$ / ha)", yVar = "Regiões";

	var force = d3.layout.force().nodes(dataAux).size([width, height]).on("tick", tick).charge(-1).gravity(0).chargeDistance(20);

	// Set initial positions
	dataAux.forEach(function(d) {
		d.x = x(d.nome_regiao);
		d.y = y(d.lucro);
		d.color = color(d.nome_regiao);
		d.radius = radius;
	});

	svg.append("g").attr("class", "axis").attr("transform", "translate(0," + y(0) + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text("Regiões");

	svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Lucro ( R$ / ha)");

	var node = svg.selectAll(".dot").data(dataAux).enter().append("circle").attr("class", "dot").attr("r", radius).attr("cx", function(d) {
		return x(d.nome_regiao);
	}).attr("cy", function(d) {
		return y(d.lucro);
	}).style("fill", function(d) {
		return d.color;
	}).on('mouseover', tip.show).on('mouseout', tip.hide);

	colocaLegendaRegioes(color,svg, width);

	// d3.select("#collisiondetection").on("change", function() {
	//   force.resume();
	// });

	force.start();
	force.resume();
	function tick(e) {
		node.each(moveTowardDataPosition(e.alpha));

		//if (checkbox.node().checked) node.each(collide(e.alpha));
		node.each(collide(e.alpha, dataAux, padding, radius));
		node.attr("cx", function(d) {
			return d.x;
		});
		// .attr("cy", function(d) { return d.y; });
	}

	function moveTowardDataPosition(alpha) {
		return function(d) {
			d.x += (x(d.nome_regiao) - d.x) * 0.05 * alpha;
			d.y += (y(d.lucro) - d.y) * 0.1 * alpha;
		};
	}
}
