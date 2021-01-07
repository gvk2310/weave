from flask import Flask
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)
# cors = CORS(app, supports_credentials=True)
CORS(app)
app_api = Api(app)

from .config import config
from .db import db
from .api import resources

app_api.add_resource(resources.Deploy, '/')
app_api.add_resource(resources.SingleDeployInfo, '/<string:id>/details')
#app_api.add_resource(resources.ServerEventMessage, '/events/deploy')
app_api.add_resource(resources.ConfigSpreadsheetGenerator,
                     '/config/<string:orchestrator>/<string:type>/<string'
                     ':asset_id>')
