var grid_producao;
var grid_tecnica;

var REST_SERVER = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest';

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

$(document).ready(function() {

	var Producao = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;

		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");

		        },
		        success: function() {
		        	var a = 1;
		        	grid_producao.render();

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

		        },
		        success: function() {
		        	var a = 1;
		        	model.fetch;
		        	atualizar_tecnica();

		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_regiao();
	atualizar_tecnica();

	function atualizar_regiao() {
		var Producoes = Backbone.Collection.extend({
			model : Producao,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/a/1/2010"
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

		grid_producao.render();

		$("#tabela_producaoes").empty();
		$("#tabela_producaoes").append(grid_producao.el);

	}

	function atualizar_tecnica() {
		var Tecnicas = Backbone.Collection.extend({
			model : Tecnica,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/tecnica_e/1/2010"
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

		grid_tecnica.render();

		$("#tabela_tecnicas").empty();
		$("#tabela_tecnicas").append(grid_tecnica.el);

	}
	
});