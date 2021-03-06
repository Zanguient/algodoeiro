function getAnosProduzidos(idAgricultorSelecionado) {

	var anos = [];
	var anosProducao = getAnos(); // Seleciona os anos

	anosProducao = anosProducao.sort(function(a, b){
 		return b.id-a.id
	});

	for (var i = anosProducao.length - 1; i >= 0; i--) {
		if(_.contains(_.pluck(getProduAgricultores(anosProducao[i]["id"]), "id_agricultor"), idAgricultorSelecionado)){
			anos.push(anosProducao[i]);
		}
	};

	return anos;
}


function getAnosProduzidosAlgodao(idAgricultorSelecionado) {

	var anos = [];
	var anosProducao = getAnos(); // Seleciona os anos

	anosProducao = anosProducao.sort(function(a, b){
 		return b.id-a.id
	});

	for (var i = anosProducao.length - 1; i >= 0; i--) {
		if(_.contains(_.pluck(getProduAgricultoresAlgodao(anosProducao[i]["id"]), "id_agricultor"), idAgricultorSelecionado)){
			anos.push(anosProducao[i]);
		}
	};

	return anos;
}