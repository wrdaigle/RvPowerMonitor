# from bottle import route, run, template, response
from flask import Flask, Response, render_template, request
from flask_compress import Compress
from flask_cors import CORS
from json import dumps
import database
import config
import os
import time
app = Flask(__name__)
Compress(app)           ## gzips when possible
CORS(app)               ## enable cors

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/api/hours/<hrs>')
def readerData(hrs):
    ct = time.time()
    data = database.getData(int(hrs))
    data['dataFetchTime'] = time.time() - ct
    return getJsonResponse(data)
    
@app.route('/utils/reboot', methods=["GET", "POST"])
def button():
    if request.method == "POST":
        os.system('sudo reboot')
        return render_template("restart.html")
    return render_template("restart.html")

def getJsonResponse(pyObj):
    jsonOut = dumps(pyObj).replace('NaN','null')
    return Response(jsonOut,mimetype='application/json')

app.run(host='0.0.0.0', port=80, debug=True)



