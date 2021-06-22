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
            except Exception as exp:
                logger.error(exp)
        return original_handler(e)


app = Flask(__name__)
app_api = Api(app)

from .config import config
from .db import db
from .api import resources

app_api.add_resource(resources.User, '/users')
app_api.add_resource(resources.SingleUserInfo, '/userinfo/<string:name>')
app_api.add_resource(resources.Role, '/roles')
app_api.add_resource(resources.Service, '/services')
app_api.add_resource(resources.GenerateToken,
                     '/token-auth/<string:encoded_service_user>'
                     '/<string:encoded_service_key>')
