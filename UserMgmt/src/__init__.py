import os
from .log import logger
from flask import Flask
from flask_restful import Api

app = Flask(__name__)
app_api = Api(app)

from .config import config
from .db import db
from .api import resources

logger.info('Executing Initial User data setup')
from . import datasetup

app_api.add_resource(resources.Authenticate, '/auth')
app_api.add_resource(resources.User, '/users')
