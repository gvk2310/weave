import os
import requests
import traceback
import json
from flask import Flask, request
from flask_restful import Resource, Api
from functools import wraps
from log import logger


request_header = {
    item.split('/')[0]: item.split('/')[1]
    for item in os.environ['request_header'].split(';')
}
vault_url = r"http://44.233.97.168:8200"  # needs to be a environment variable
vault_token = 'devnetops'  # this has to be a k8 secret
token_auth_url = r"http://dno-dev.acndevopsengineering.com/umg37"  # needs to
# be a environment variable
####################################################
# vault_url = os.environ['vaultUrl']
# vault_token = os.environ['vaultToken']
# token_auth_url = os.environ['usermgmtUrl']

def logs(msg, traceback, exception):
    logger.error(msg)
    logger.debug(traceback)
    logger.error(exception)

def verifyToken(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.headers['Authorization'].split()[0] != 'Bearer':
            return {"msg": "Token required"}, 500, request_header
        token = request.headers['Authorization'].split()[1]
        perm = 'read' if request.method == 'GET' else 'write'
        resp = requests.get(
            f"{token_auth_url}/isauthorized?svc=vault&perm={perm}",
            headers={f'Authorization': f'Bearer {token}',
                     'Content-Type': 'application/json'},
        )
        if resp != 200:
            return resp.json(), resp.status_code
        return fn(*args, **kwargs)
    return wrapper

class RepoDetails(Resource):

    @verifyToken
    def get(self, repo_name):
        try:
            resp = requests.get(
                f'{vault_url}/v1/secret/data/{repo_name}',
                headers={'X-Vault-Token': vault_token})
            if resp.status_code == 200:
                return resp.json(), resp.status_code
            else:
                return {'msg': 'Unable to process the request'}, 404
        except Exception as e:
            logs('Unable to retrieve data from vault', traceback.format_exc(),
                 e)
    @verifyToken
    def post(self, repo_name):
        try:
            repodata = {"data": request.json}
            resp = requests.post(
                f"{vault_url}/v1/secret/data/{repo_name}",
                headers={'X-Vault-Token': vault_token,
                         'Content-Type': 'application/json'},
                data=json.dumps(repodata))
            if resp.status_code == 200:
                return {'msg': 'Data added successfully'}, resp.status_code
            else:
                return {'msg': 'Data could not be added'}, 400
        except Exception as e:
            logs('Unable to post data to vault', traceback.format_exc(), e)
    @verifyToken
    def delete(self, repo_name):
        try:
            resp = requests.delete(
                f"{vault_url}/v1/secret/data/{repo_name}",
                headers={'X-Vault-Token': vault_token})
            if resp.status_code == 204:
                return {'msg': 'Data deleted successfully'}, resp.status_code
            else:
                return {'msg': 'Data deletion failed'}, 404
        except Exception as e:
