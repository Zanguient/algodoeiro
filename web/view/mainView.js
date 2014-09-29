function graficoProducaoRegiaoAbsoluto(ano) {

	var producao_regiao = getProducaoRegiao(ano);
	$("#grafico_regiao").html("");

	if(_.size(producao_regiao)>0){
		//Nome das culturas
		var culturas = _.keys(producao_regiao);
		//Matriz m x n, m culturas x n regioes
		var layers = _.values(producao_regiao);
		//Nome das regiões
		var labels = _.pluck(_.values(producao_regiao)[0], 'regiao');

		var novoLayers = ordenaCulturasPorProducao();

		var culturasNovaOrdem = [];

		for(i = 0; i < novoLayers.length; i++){
			culturasNovaOrdem.push(novoLayers[i][0].cultura);
		}
		graficoProducaoRegiao("#grafico_regiao", novoLayers, labels, culturasNovaOrdem);
	} else{
		$("#grafico_regiao").html("Sem Produção nesse ano.");
	}
	function ordenaCulturasPorProducao() {
		var layerApodi = [];
		var layerCariri = [];
		var layerPajeu = [];

		//NOVO
		var layersRegiao = []
		layersRegiao[0] = []

		//Nome das culturas
		var copiaCulturas = culturas.slice();

		//O valor da produção de todas as culturas da primeira região
		for (var i in layers) {
			layersRegiao[0][i] = layers[i][0];
		}

		layersRegiao[0].sort(function(a, b) { //da sort em apodi pela produçao
			return b.producao - a.producao;
		});

		ordenaListaDeCulturas(culturas, layersRegiao[0]);

		layersRegiao[0] = colocaOrdemCerta(culturas, layersRegiao[0]);

		if (layersRegiao[0][0] == undefined){
			alert("Erro, contate o administrador!");
		}

		//organiza as barras seguintes de acordo com as culturas ordenadas por apodi
		var novoLayer = [];
		var copyLayer = layers;
		for (j = 0; j < layersRegiao[0].length; j++){
			var culturaAtual = layersRegiao[0][j].cultura;
			//novoLayer.push(layers[copiaCulturas.indexOf(layersRegiao[0][j].cultura)]);
			var objectInLayers = _.find(layers, function(layer){ return layer[0].cultura == culturaAtual; })
			var indexInLayers = _.indexOf(layers,objectInLayers);
			layers.splice(indexInLayers,1);
			novoLayer.push(objectInLayers);

		}

		novoLayer = _.union(novoLayer,layers);

		return novoLayer;
		
		//ordenaListaDeCulturas(culturas, layersRegiao[0]);
	}

	function colocaOrdemCerta(culturas, layer){
		function rearranjaCulturasAlgodao(objeto,layer,layerNovo,position){
			if(!(typeof objeto === "undefined")) {
				layerNovo.splice(position,0,objeto);
				var indexObjeto = _.indexOf(layer,objeto);
				layer.splice(indexObjeto,1);

			}
		}
		var pluma = "Pluma";
		var caroco = "Caroço";
		var algodao = "Algodão Aroeira";

		//Encontra onde estão os layers de Algoi
		var algodaoObjeto = _.find(layer,function(item){return item.cultura == algodao;});
		var plumaObjeto = _.find(layer,function(item){return item.cultura == pluma;});
		var carocoObjeto = _.find(layer,function(item){return item.cultura == caroco;});

		var layerNovo = [];
		rearranjaCulturasAlgodao(algodaoObjeto,layer,layerNovo,0);
		rearranjaCulturasAlgodao(carocoObjeto,layer,layerNovo,1);
		rearranjaCulturasAlgodao(plumaObjeto,layer,layerNovo,2);
	
		//if(!(typeof carocoObjeto === "undefined")) layerNovo.splice(1,0,carocoObjeto);
		//if(!(typeof plumaObjeto === "undefined")) layerNovo.splice(2,0,plumaObjeto);


		layerNovo = _.union(layerNovo,layer);

		return layerNovo;

	}
	//organiza o array com os nomes das culturas de acordo com apodi
	function ordenaListaDeCulturas(culturas, layerApodi) {
		for (var i = 0; i < culturas.length; i++) {
			culturas[i] = layerApodi[i].cultura;
		}
	}

	function agrupaAlgodao(culturas, layerApodi) {
		//culturas = culturas.sort();
		var qtdeCulturasAgrupar = 3;
		var pluma = "Pluma";
		var caroco = "Caroço";
		var algodao = "Algodão Aroeira";
		var iPluma = culturas.indexOf(pluma);
		var iAlgodao = culturas.indexOf(algodao);
		var iCaroco = culturas.indexOf(caroco);

    	layerApodi.unshift(layerApodi[iAlgodao], layerApodi[culturas.indexOf(caroco)], layerApodi[culturas.indexOf(pluma)]);
    	layerApodi.splice(iPluma + qtdeCulturasAgrupar, 1);
		layerApodi.splice(iCaroco + qtdeCulturasAgrupar, 1);
		layerApodi.splice(iAlgodao + qtdeCulturasAgrupar, 1);
	}
}

function plotaGraficoProducaoAgricultor(idAgricultor, idRegiao, ano) {
	var produ_agricultores = getProduAgricultores(ano);
	var agricultores = getAgricultores(idRegiao);
	var regioes = getRegioes();
	var media_producao_regiao = getMediaProducaoRegiao(ano);
    

    var divs = {comunidadeDiv: "#info_comunidade_producao", cidadeDiv: "#info_cidade_producao", areaDiv:"#info_area_produzida_producao", certificacaoDiv: "#info_certificado_producao"}

	// ---------------------- MAIN -----------------------
	    changeInfoAgricultor(idAgricultor, ano, divs); // Funcao no arquivo changeInfoAgricultor.js
	    changeGraficoProduAgricultor(idAgricultor, idRegiao);
	// ---------------------------------------------------

	function agrupaAlgodao(labels) {
		culturas = labels.slice();
		var qtdeCulturasAgrupar = 3;
		var pluma = "Pluma";
		var algodao = "Algodão Aroeira";
		var caroco = "Caroço";
		var iPluma = culturas.indexOf(pluma);
		var iCaroco = culturas.indexOf(caroco);
		var iAlgodao = 0;
		culturas.indexOf(algodao);
		//verificar se o agricultor plantou algodao, caso nao ache o index, retorna -1
		if (culturas.indexOf(algodao) >= 0 && iPluma >= 0 && iCaroco >= 0) {
			labels.unshift(labels[labels.indexOf(algodao)],labels[labels.indexOf(caroco)], labels[labels.indexOf(pluma)]);
			labels.splice(iPluma + qtdeCulturasAgrupar, 1);
			labels.splice(iCaroco + qtdeCulturasAgrupar, 1);
			labels.splice(iAlgodao + qtdeCulturasAgrupar, 1);
		}
	}

	function changeGraficoProduAgricultor(agricultorId, regiaoSelecionadaId) {
		// Produção do Agricultor
		var selecionados = _.filter(produ_agricultores, function(object) {
			return object.id_agricultor == agricultorId;
		});

		var producaoAgricultor = selecionados;
		producaoAgricultor = _.sortBy(producaoAgricultor, "id_cultura");

		// Média região atual
		var media_regiao_atual = _.filter(media_producao_regiao, function(object) {
			return object.id_regiao == regiaoSelecionadaId;
		});

		// Média da produção da região das culturas que o agricultor plantou
		var media_agricultor = _.filter(media_regiao_atual, function(object) {
			return _.contains(_.pluck(selecionados, 'id_cultura'), object.id_cultura);
		});
		media_agricultor = _.sortBy(media_agricultor, "id_cultura");

		// Cria dataframe
		var quant_culturas = media_agricultor.length;
		var layers = [producaoAgricultor, media_agricultor];
		var labels = _.pluck(selecionados, 'nome_cultura');

		agrupaAlgodao(labels);

		graficoProducaoPorAgricultor("#grafico_agricultor", layers, labels);
	}

}


function plotGraficoProdutividadeRegiao(idAgricultor, idAno) {
	
    var regioes = getRegioes();

    //var agricultores = getProdutores();

    var agricultores = getProdutorAlgodao();

    var produtividade = getProdutividade(idAno);
   

    //cria array com resultado da busca pelo nome do agricultor
    if(eh_admin){
    	var selecionado = $.grep(produtividade, function(e) {
	        return e.id_agricultor == idAgricultor;
	    });
	    var agricultor = selecionado[0];

	    var divs = {comunidadeDiv: "#info_comunidade_produtividade", cidadeDiv: "#info_cidade_produtividade", areaDiv:"#info_area_produzida_produtividade", certificacaoDiv: "#info_certificado_produtividade"}
	    changeInfoAgricultor(idAgricultor, idAno, divs);  // Funcao no arquivo changeInfoAgricultor.js
		
	}
    //var result = $.grep(produtividade, function(e){ return e.nome_agricultor == nomeAgricultor; });
    //var agricultor = result[0];
/*
    var produtividade_regiao = [];
    // Seleciona so os agricultores da mesma regiao
    produtividade.forEach(function(d) {
        produtividade_regiao.push(d);
    });*/

	//Remove qualquer gráfico que já exista na seção
	d3.select("#produtividadeGraf").selectAll("svg").remove();
	$("#produtividadeGraf").html("");

	if (produtividade.length == 0){
        $("#produtividadeGraf").html("Sem Produção nesse ano.");
    } else {
		graficoProdutividadeRegiao("#produtividadeGraf", agricultor,  produtividade, regioes);
	}
}


function plotGraficoProducaoRegiao(idAgricultor, idAno) {
	
    var regioes = getRegioes();

    //var agricultores = getProdutores();

    var agricultores = getProdutorAlgodao();

	var producao = getProduAgricultores(idAno);

	producao = _.filter(producao, function(object) {
			return object.id_cultura == 1;
		});
   
    //cria array com resultado da busca pelo nome do agricultor
    if (eh_admin){
    	var selecionado = $.grep(producao, function(e) {
	        return e.id_agricultor == idAgricultor;
	    });
	    var agricultor = selecionado[0];

	    var divs = {comunidadeDiv: "#info_comunidade_producao_dos_agricultores", cidadeDiv: "#info_cidade_producao_dos_agricultores", areaDiv:"#info_area_produzida_producao_dos_agricultores", certificacaoDiv: "#info_certificado_producao_dos_agricultores"};
	    changeInfoAgricultor(idAgricultor, idAno, divs);  // Funcao no arquivo changeInfoAgricultor.js
	}
    //var result = $.grep(produtividade, function(e){ return e.nome_agricultor == nomeAgricultor; });
    //var agricultor = result[0];
/*
    var produtividade_regiao = [];
    // Seleciona so os agricultores da mesma regiao
    produtividade.forEach(function(d) {
        produtividade_regiao.push(d);
    });*/

	
	//Remove qualquer gráfico que já exista na seção
	d3.select("#grafico_producao_dos_agricultores").selectAll("svg").remove();
	$("#grafico_producao_dos_agricultores").html("");

	if (producao.length == 0){
        $("#grafico_producao_dos_agricultores").html("Sem Produção nesse ano.");
    } else {
		graficoJitterProducaoAgricultores("#grafico_producao_dos_agricultores", agricultor,  producao, regioes);
	}
}