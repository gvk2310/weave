from flask import Flask
from flask_restful import Api
from .log import logger

app = Flask(__name__)
api = Api(app)

from . import onBoardRepoDetails

api.add_resource(onBoardRepoDetails.OnBoardRepoDetails, '/repodetails/<string:repo_name>')
