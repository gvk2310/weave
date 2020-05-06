from .log import logger
from flask import Flask
from flask_restful import Api

app = Flask(__name__)
app_api = Api(app)

from .config import config
from .db import db
from .api import resources

@app.before_first_request
def initialDataSetup():
    db.createSvc('svc1')
    db.createSvc('svc2')
    db.createRole('admin', ["svc1", "svc2"], ["svc1", "svc2"])
    db.createUser('Admin', 'admin@acc.com', 'Admin@123', ['admin'])


app_api.add_resource(resources.Authenticate, '/auth')
app_api.add_resource(resources.User, '/users')
app_api.add_resource(resources.Role, '/roles')
app_api.add_resource(resources.Service, '/service')
