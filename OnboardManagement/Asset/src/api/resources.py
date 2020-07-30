import re
from flask_restful import Resource, request
from werkzeug.utils import secure_filename
import os
from flask import Flask
from flask import abort
from urllib.request import urlopen
import pyclamd
from ..log import logger


ALLOWED_EXTENSIONS = {'txt', 'pdf', 'yaml'}


app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def scan_for_virus(repo_details):
    try:
        cd = pyclamd.ClamdUnixSocket()
        cd.ping()
    except pyclamd.ConnectionError as ce:
        cd = pyclamd.ClamdNetworkSocket()
        logger.error("Unable to connect to Clamd :: "+str(ce))
        return {"msg": "could not connect to clamd server either by unix or network socket"}, 500
    scan_result = cd.scan_stream(repo_details.stream)
    #repo_details.stream.seek(0)
    if scan_result is not None:  # In this case ClamAV found a virus !
        logger.warning("Virus found into {0} :: {1}".format(repo_details.filename, scan_result['stream'][1]))
        return {"msg": "Virus found !"}, 502


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class Upload(Resource):
    def post(self):
        if 'file' not in request.files:
            return{'message': 'No file part in the request'}, 400
        file = request.files['file']
        if file.filename == '':
             return{'message': 'No file selected for uploading'}, 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #file.save(path, filename)
            print(filename)
            scan_for_virus(filename)
            return{'message': 'File uploaded'}, 200
        else:
            return{'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'}, 400