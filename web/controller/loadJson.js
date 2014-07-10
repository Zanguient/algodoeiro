/*
    Cria metodos de acesso aos JSONs, todos sao requisitados apenas uma vez (na primeira vez),
    isso e feito para evitar multiplas requisicoes ao mesmo JSON.

*/
var receitaURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/"; // Precisa adicionar o ano (isso é feito no metodo get)
var lucroURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/lucro/"; // Precisa adicionar o ano (isso é feito no metodo get)
var custosURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/custo/total";
var regioesURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";

var produAgricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/";  // Precisa adicionar o ano (isso é feito no metodo get)
var produtividadeURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/produtividade/"; // Precisa adicionar o ano (isso é feito no metodo get)
var agricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores";
var produtoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtores";
var produtoresAlgodaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtores/algodao";

var mediaProducaoRegiaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/media/"; // Precisa adicionar o ano (isso é feito no metodo get)

/*
 * Inicializa variaveis, que irão armazenar os JSONs 
 */ 

var custos, regioes, agricultores, produtores, produtoresAlgodao;
var receita = {};
var lucro = {};
var producaoAgricultores = {};
var produtividade = {};
var mediasProducaoRegiao = {};


function getCusto() {
    if(custos == undefined) {
        custos = readJSON(custosURL);
    }
    
    return custos;
}

function getRegioes() {
    if(regioes == undefined) {
        regioes = readJSON(regioesURL);
    }
    
    return regioes;
}

function filtraAgricultoresRegiao(idRegiao, agricultores) {
    var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
        return idRegiao == agricultor.id_regiao;
    });

    return agricultoresDaRegiao;
}
    
function getAgricultores(idRegiao) {
    if(agricultores == undefined) {
        agricultores = readJSON(agricultoresURL);
    }
    
    return filtraAgricultoresRegiao(idRegiao, agricultores);

  
}

function getProdutores(idRegiao) {
    if(produtores == undefined) {
        produtores = readJSON(produtoresURL);
    }
    
    return filtraAgricultoresRegiao(idRegiao, produtores);
}

function getProdutoresAlgodao(idRegiao) {
    if(produtoresAlgodao == undefined) {
        produtoresAlgodao = readJSON(produtoresAlgodaoURL);
    }
    
    return filtraAgricultoresRegiao(idRegiao, produtoresAlgodao);
    
}

function getReceita(ano) {
    if(!_.has(receita, ano)) {
        receita[ano] = readJSON(receitaURL + ano);
    }
    
    return receita[ano];
}

function getLucro(ano) {
    if(!_.has(lucro, ano)) {
        lucro[ano] = readJSON(lucroURL + ano);
    }
    
    return lucro[ano];
}

function getProduAgricultores(ano) {
    if(!_.has(producaoAgricultores, ano)) {
        producaoAgricultores[ano] = readJSON(produAgricultoresURL + ano);
    }
    
    return producaoAgricultores[ano];    
}

function getProdutividade(ano) {
    if(!_.has(produtividade, ano)) {
        produtividade[ano] = readJSON(produtividadeURL + ano);
    }
    
    return produtividade[ano]; 
}

function getMediaProducaoRegiao(ano) {
    if(!_.has(mediasProducaoRegiao,ano)) {
        mediasProducaoRegiao[ano] = readJSON(mediaProducaoRegiaoURL + ano);
    }
    
    return mediasProducaoRegiao[ano];
}

function setMediaProducaoRegiao(novaUrlMediaProducaoRegiao) {
    mediaProducaoRegiaoURL = novaUrlMediaProducaoRegiao;
    readJSON(mediaProducaoRegiaoURL);
}