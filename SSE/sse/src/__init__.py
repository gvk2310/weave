from flask import Flask
from flask_restful import Api
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, supports_credentials=True)
app_api = Api(app)

from .config import config
from .api import resources


app_api.add_resource(resources.ServerEventMessage, '/<string:type>')
