var grid_producao;
var grid_tecnica;

var REST_SERVER = 'http://localhost:5001';

function readJSON(url){
	var dataframe;

	$.ajax({
        url : url,
        type : 'GET',
        async: false,
        dataType : 'json',
        success: function(data) { 
        	console.log("success ajax!");
        	dataframe = data;
         },                                                                                                                                                                                       
       error: function(xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          console.log(err.Message);
        }
    });

	return dataframe;
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

var dadosAgricultor = parseURLParams(document.URL);

//alert(dadosAgricultor.id);
//alert(dadosAgricultor.ano);

$(document).ready(function() {
	$("#titulo_prod_tec").append(dadosAgricultor.nome);

	var Producao = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;

		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		       		atualizar_producao();
		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	var Tecnica = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;

		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		       		atualizar_tecnica();
		        },
		        success: function() {
		        	atualizar_tecnica();

		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_producao();
	atualizar_tecnica();

	function atualizar_producao() {
		var Producoes = Backbone.Collection.extend({
			model : Producao,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://0.0.0.0:5001/producao_tec_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
		});

		var producoes = new Producoes();
		producoes.fetch({
			reset : true
		});

	//	resetarForm();

		var columns = [
		{
			name : "id", 
			label : "Id", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "id_producao", 
			label : "Id Cultura", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "nome_cultura",
			label : "Nome",
			cell : "string",
			editable : false 

		}, {
			name : "quantidade_produzida",
			label : "Produção",
			cell : "number"
		}];

		grid_producao = new Backgrid.Grid({
			columns : columns,
			collection : producoes
		});

		grid_producao.render().sort("nome_cultura", "ascending");

		$("#tabela_producaoes").empty();
		$("#tabela_producaoes").append(grid_producao.el);

	}

	$('#area_atividade').change("input", function(){	
		
		$.ajax({
			type: 'post',
			contentType: "application/json; charset=utf-8",
			scriptCharset: "utf-8" ,
			// criar adicionaAgricultor
			url: REST_SERVER + '/editaAreaProducao/'+dadosAgricultor.id+"/"+dadosAgricultor.ano,
			data: JSON.stringify({"area_plantada": $('#area_atividade').val()}),
			dataType: 'json',
			success: function(){
			   	atualizar_producao();
			},
			error: function(){
			   alert('failure');
			}
		});
	});

	$('#data_calendario').change("input", function(){	

	});


	$("#data_calendario").datepicker({
    language: "pt-BR",
    format: 'dd/mm/yyyy',
    startDate: "01/01/"+dadosAgricultor.ano,
    endDate: "31/12/"+dadosAgricultor.ano,
	})

	function atualizar_tecnica() {
		var Tecnicas = Backbone.Collection.extend({
			model : Tecnica,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://0.0.0.0:5001/tecnica_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
		});

		var tecnicas = new Tecnicas();
		tecnicas.fetch({
			reset : true
		});

		var columns = [
		{
			name : "id", 
			label : "Id", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "id_tecnica_adotada", 
			label : "Id Tecnica Adotada", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "nome_tecnica",
			label : "Nome",
			cell : "string",
			editable : false 

		}, {
			name : "utilizou",
			label : "Utilizou",
			cell : "boolean"
		}];

		grid_tecnica = new Backgrid.Grid({
			columns : columns,
			collection : tecnicas
		});

		grid_tecnica.render().sort("nome_tecnica", "ascending");


		$("#tabela_tecnicas").empty();
		$("#tabela_tecnicas").append(grid_tecnica.el);

	}


});