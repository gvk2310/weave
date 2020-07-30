from .log import logger
from flask_jwt_extended import JWTManager
from flask import Flask
from flask_restful import Api
import os


app = Flask(__name__)
app_api = Api(app)

from .config import config

from .api import resources

app_api.add_resource(resources.Upload, '/upload')
#app_api.add_resource(resources.Download,'/download')



