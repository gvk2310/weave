from .log import logger
from flask_jwt_extended import JWTManager
from flask import Flask
from flask_restful import Api

app = Flask(__name__)
app_api = Api(app)

from .config import config

jwt = JWTManager(app)

from .db import db
from .api import resources

app_api.add_resource(resources.Authenticate, '/auth')
app_api.add_resource(resources.User, '/users')
app_api.add_resource(resources.Role, '/roles')
app_api.add_resource(resources.Service, '/service')
app_api.add_resource(resources.IsAuthorized, '/isauthorized')
