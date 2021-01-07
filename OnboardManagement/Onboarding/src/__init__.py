from flask import Flask
from flask_restful import Api
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, supports_credentials=True)
app_api = Api(app)

from .config import config
from .db import db
from .api import resources

app_api.add_resource(resources.Asset, '/asset')
app_api.add_resource(resources.Repository, '/repo')
app_api.add_resource(resources.Infra, '/infra')
app_api.add_resource(resources.Tests, '/tests')
#app_api.add_resource(resources.ServerEventMessage, '/events/<string:type>')
app_api.add_resource(resources.AssetDownloadDetails, '/assetdetails')
