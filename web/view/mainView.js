function graph1() {

  var data =   readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/2011");
  var regioes = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes");

  //Remove qualquer gráfico que já exista na seção
  d3.select("#custo_regiao").selectAll("svg").remove();
  graficoBalanco("#custo_regiao",data,regioes);

}



function graph2() {

    var producao_regiao = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/2011");

    var culturas = _.keys(producao_regiao);
    var layers = _.values(producao_regiao);
    var labels = _.pluck(_.values(producao_regiao)[0], 'regiao');

    ordenaCulturasPorProducao();

    function ordenaCulturasPorProducao() {
        var layerApodi = [];
        var layerCariri = [];
        var layerPajeu = [];
        var copiaCulturas = culturas.slice();

        for (var i in layers) {
            layerApodi[i] = layers[i][0];
        }

        layerApodi.sort(function(a, b) {//da sort em apodi pela produçao
            return b.producao - a.producao;
        });

        ordenaListaDeCulturas(culturas, layerApodi);

        agrupaAlgodao(culturas, layerApodi);

        //organiza as barras seguintes de acordo com as culturas ordenadas por apodi
        for (var i in layers) {
            layerCariri[i] = layers[copiaCulturas.indexOf(layerApodi[i].cultura)][1];
            layerPajeu[i] = layers[copiaCulturas.indexOf(layerApodi[i].cultura)][2];
        }
        //passa os valores pros layers finais
        for (var i in layers) {
            layers[i][0] = layerApodi[i];
            layers[i][1] = layerCariri[i];
            layers[i][2] = layerPajeu[i];
        }
        ordenaListaDeCulturas(culturas, layerApodi);
    }

    //organiza o array com os nomes das culturas de acordo com apodi
    function ordenaListaDeCulturas(culturas, layerApodi) {
        for (var i = 0; i < culturas.length; i++) {
            culturas[i] = layerApodi[i].cultura;
        }
    }

    function agrupaAlgodao(culturas, layerApodi) {
        //culturas = culturas.sort();
        var qtdeCulturasAgrupar = 2;
        var pluma = "Pluma";
        //var algodao = "Algodo Aroeira";
        var iPluma = culturas.indexOf(pluma);
        //var iAlgodao = culturas.indexOf(algodao);
        var iAlgodao = 0;
        layerApodi.unshift(layerApodi[iAlgodao], layerApodi[culturas.indexOf(pluma)]);

        layerApodi.splice(iPluma + qtdeCulturasAgrupar, 1);
        layerApodi.splice(iAlgodao + qtdeCulturasAgrupar, 1);
    }

    graficoProducaoRegiao("#grafico_regiao",layers, labels, culturas);

}

function graph3() {

    var produ_agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/2011");
    var agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores");
    var regioes = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes");
    var media_producao_regiao = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/media/2011");

    produ_agricultores = _.filter(produ_agricultores, function(produ) {
        return produ.producao > 0;
    });

    agricultores = _.filter(agricultores, function(agricultor) {
        return _.contains(_.pluck(produ_agricultores, 'id_agricultor'), agricultor.id);
    });

    //DropDown regiões
    var selectRegioes = d3.select("#droplist_regioes")
        .append("select")
        .attr("id", "select_regioes")
        .on("change", function() {
                changeAgricultores(this.options[this.selectedIndex].value);
            }
        )
        .selectAll("option")
            .data(regioes)
            .enter()
            .append("option")
            .attr("value", function(d) {
            return d.id;
        })
        .text(function(d) {
            return d.regiao;
        });

    //DropDown agricultores
    var selectAgricultores = d3.select("#droplist_agricultores").append("select").attr("id", "select_agricultores").on("change", function() {
        changeGraficoProduAgricultor(this.options[this.selectedIndex].value, $("#select_regioes").val());
    })
    .selectAll("option")
        .data(agricultores)
        .enter()
        .append("option")
        .attr("value", function(d) {
        return d.id;
    })
    .text(function(d) {
        return d.nome_agricultor;
    });

    function changeAgricultores(regiaoSelecionadaId) {
        // Remove agricultores do dropdown
        d3.select("#select_agricultores").selectAll("option").remove();

        // Seleciona agricultores
        var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
            return regiaoSelecionadaId == agricultor.id_regiao;
        });

        // Popula DropDown
        d3.select("#select_agricultores")
            .selectAll("option")
            .data(agricultoresDaRegiao)
            .enter()
            .append("option")
            .attr("value", function(d) {
                return d.id;
            })
            .text(function(d) {
                return d.nome_agricultor;
            });

        // Valor Default
        var valorAtualAgricultores = $("#select_agricultores").val();

        changeGraficoProduAgricultor(valorAtualAgricultores, regiaoSelecionadaId);
    }

    function dropAllInfos() {
        d3.select("#info_comunidade").selectAll("g").remove();
        d3.select("#info_cidade").selectAll("g").remove();
        d3.select("#info_area_produzida").selectAll("g").remove();
    }

    function changeInfoAgricultor(agricultorId, regiaoSelecionadaId) {
        // remove dados que ja existam
        dropAllInfos();

        var agricultorSelecionado = _.filter(agricultores, function(object) {
            return object.id == agricultorId;
        })[0];

        var producaoSelecionada = _.filter(produ_agricultores, function(object) {
            return object.id_agricultor == agricultorId;
        });
        
        var comunidadeMsg = agricultorSelecionado.nome_comunidade;


        var cidadeMsg = agricultorSelecionado.nome_cidade;

        var areaValue = producaoSelecionada[0].area;
        // Testa para valores null
        if (areaValue !== null) {
            areaMsg = areaValue + " ha";
        } else {
            areaMsg = "Não Informada";
        }
       
        // append nome comunidade
        d3.select("#info_comunidade")
            .append("g")
            .text(comunidadeMsg);

        // append nome cidade
        d3.select('#info_cidade')
             .append("g")
             .text(cidadeMsg);

        // append area produzida
        d3.select('#info_area_produzida')
            .append("g")
            .text(areaMsg);
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
        
        changeInfoAgricultor(agricultorId, regiaoSelecionadaId);
        graficoProducaoPorAgricultor("#grafico_agricultor",layers, labels);

    }

    var valorAtualRegioes = $("#select_regioes").val();
    changeAgricultores(valorAtualRegioes);

}
