from flask import Flask
from flask_restful import Api

app = Flask(__name__)
api = Api(app)

api.add_resource(RepoDetails, '/repodetails/<string:repo_name>')
