from .log import logger
from flask_jwt_extended import JWTManager
from flask import Flask
from flask_restful import Api as _Api


class Api(_Api):


    def error_router(self, original_handler, e):
        error_type = type(e).__name__.split(".")[-1]
        if self._has_fr_route() and error_type in ['UnprocessableEntity',
                                                   'BadRequest']:
            try:
                return self.handle_error(e)
            except Exception:
                pass
        return original_handler(e)


app = Flask(__name__)
app_api = Api(app)

from .config import config

jwt = JWTManager(app)

from .db import db
from .api import resources

app_api.add_resource(resources.Authenticate, '/auth')
app_api.add_resource(resources.User, '/users')
app_api.add_resource(resources.SelfChanges, '/users/self')
app_api.add_resource(resources.Role, '/roles')
app_api.add_resource(resources.Service, '/services')
app_api.add_resource(resources.IsAuthorized,
                     '/isauthorized/<string:svc>/<string:perm>')
