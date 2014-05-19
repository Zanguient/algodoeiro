from flask import Flask, make_response
import dadosApiRest

app = Flask(__name__)

@app.route('/tiposDeProducao')
def tipos_de_producao():
	response = dadosApiRest.tipos_de_producao()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
