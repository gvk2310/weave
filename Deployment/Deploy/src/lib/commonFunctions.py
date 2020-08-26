import os
import re
import jenkins
import requests
import traceback
from ..log import logger
from functools import wraps
from flask_restful import request
from werkzeug.datastructures import FileStorage

jenkins_url = os.environ['jenkins_url']
jenkins_username = os.environ['jenkins_username']
jenkins_password = os.environ['jenkins_password']
jenkins_token = os.environ['jenkins_token']
onboarding_url = os.environ['onboarding_url']
token_auth_url = os.environ['usermgmtUrl']


def nonEmptyString(value):
    if isinstance(value, str) and value.strip() and re.match(
            r'^[a-zA-Z0-9\-_|]+$', value):
        return value
    else:
        raise ValueError(
            'The string value is either empty or not allowed. Alphanumeric '
            'string with special characters (-_) allowed')


def genericString(value):
    if len(value) > 0:
        return value
    else:
        raise ValueError(
            'The string value is either empty or not allowed. Alphanumeric '
            'string with special characters (-_) allowed')


def csvFileType(file):
    if not isinstance(file, FileStorage) or file.filename.split('.')[
        -1] != 'csv':
        raise ValueError('Not a valid file input')
    return file


def verifyJenkins(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if 'Auth-Token' not in request.headers.keys() or \
                not request.headers['Auth-Token'].strip():
            return {"msg": "Jenkins auth token required"}, 500
        if request.headers['Auth-Token'] != jenkins_token:
            return "Invalid Jenkins auth token", 500
        return fn(*args, **kwargs)

    return wrapper


def verifyToken(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if 'Authorization' not in request.headers.keys() or \
                request.headers['Authorization'].split()[0] != 'Bearer':
            return {"msg": "Token required"}, 500
        token = request.headers['Authorization'].split()[1]
        perm = 'read' if request.method == 'GET' else 'write'
        resp = requests.get(
            f"{token_auth_url}/isauthorized/vault/{perm}",
            headers={f'Authorization': f'Bearer {token}',
                     'Content-Type': 'application/json'},
        )
        if resp.status_code != 200:
            return resp.json(), resp.status_code
        return fn(*args, **kwargs)

    return wrapper


def assetDownloadDetails(assets):
    try:
        token = request.headers['Authorization'].split()[-1]
        data = requests.get(f"{onboarding_url}/assetdetails?assets={assets}",
                            headers={f'Authorization': f'Bearer {token}'})
        return data.json()
    except Exception as e:
        logger.error("Unable to get asset download detail")
        logger.debug(traceback.format_exc())
        logger.error(e)


def triggerJenkins(parameters, job_name):
    try:
        srv = jenkins.Jenkins(jenkins_url, username=jenkins_username,
                              password=jenkins_password)
        srv.build_job(job_name, parameters=parameters,
                      token=jenkins_token)
        return True
    except Exception as e:
        logger.error("Unable to trigger Jenkins Job")
        logger.debug(traceback.format_exc())
        logger.error(e)
