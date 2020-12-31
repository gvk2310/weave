import os
import re
import json
import requests
from ..log import logger
from .jfrog import uploadToJfrog, deleteFromJfrog
from .vault import retrieveUrl
from .nexus import deleteFromNexus
from ..db import db
from flask_restful import request
from ..lib.sse import publish_onboard_events
from functools import wraps
from werkzeug.datastructures import FileStorage

token_auth_url = os.environ['usermgmtUrl']

def non_empty_string(string):
    if not string:
        raise ValueError("Must not be empty string")
    return string

# This is for test_parameters  
def json_loads(data):
    val = json.loads(data)
    for item in val:
        if not ('name' in item.keys() and 'default' in item.keys()):
            raise ValueError("Missing required keys in test_parameters")
    return val

def validStrChecker(string):
    regex = re.match("^[A-Za-z0-9_-]*$", string)
    if (regex == None):
        return False
    else:
        return True

      
def checkStringLength(string):
    if (len(string) <= 25):
        return True
    else:
        return False
      
def zipFileType(file):
    if not isinstance(file, FileStorage) or \
            file.filename.split('.')[-1] not in ['zip', 'gz']:
        raise ValueError('Not a zip or gzip file input')
    return file

def verifyToken(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if 'Authorization' not in request.headers.keys() or \
                request.headers['Authorization'].split()[0] != 'Bearer':
            return {"msg": "Token required"}, 500
        token = request.headers['Authorization'].split()[1]
        perm = 'read' if request.method == 'GET' else 'write'
        resp = requests.get(
            f"{token_auth_url}/isauthorized/onboard/{perm}",
            headers={f'Authorization': f'Bearer {token}',
                     'Content-Type': 'application/json'},
        )
        if resp.status_code != 200:
            return resp.json(), resp.status_code
        return fn(*args, **kwargs)

    return wrapper
  
  
def assetDeletefromRepo(asset):
    repo_details = retrieveUrl(asset["asset_repository"].lower())
    if not repo_details:
        return {"msg": "Unable to retrieve repo details"}, 500
    if repo_details[
        'repo_vendor'].lower() == 'jfrog':
        resp = deleteFromJfrog(asset['asset_link'], repo_details)
    if repo_details[
        'repo_vendor'].lower() == 'nexus':
        resp = deleteFromNexus(asset['asset_link'], repo_details)
        if not resp:
            return {"msg": "Unable to delete asset from repository"}, 500
    check = db.delete(assetid=asset['asset_id'])
    if check:
        return {'msg': 'Asset Deleted'}, 200


def format_bytes(size):
    power = 2 ** 10
    n = 0
    power_labels = {0: 'bytes', 1: 'KB', 2: 'MB', 3: 'GB', 4: 'TB'}
    while size > power:
        size /= power
        n += 1
    return str(round(size, 1)) + power_labels[n]




def scanFile(args):
    try:
        resp = os.popen(f"clamscan {args['asset_file_loc']}").read()
        if not "Infected files" in resp:
            return False
        return_val = \
            [int(item.split(':')[1].strip()) < 1 for item in resp.split('\n')
             if item.split(':')[0] == 'Infected files'][0]
        return return_val
    except Exception as e:
        logger.error(e)


def localAssetOnboarding(args, repo_details):
    secured = scanFile(args)
    if not secured:
        logger.error('Insecured File. Aborting Asset Onboarding.')        
        db.update(assetid=args['assetid'],
                  scan_result='Vulnerable',
                  onboard_status='Aborted')
        publish_onboard_events(assetid=args['assetid'],
                              scan_result='Vulnerable',
                              onboard_status='Aborted',
                              type='asset')
        os.remove(args['asset_file_loc'])
        return False   
    db.update(assetid=args['assetid'],
              scan_result='Safe')
    publish_onboard_events(assetid=args['assetid'],
                          scan_result='Safe',
                          type='asset')
    if repo_details['repo_vendor'] == 'jfrog':
        relTargetPath = f"{args['asset_vendor']}/{args['asset_group']}/" \
                         f"{args['asset_file_name']}-V{args['asset_version']}"
        resp = uploadToJfrog(relTargetPath=relTargetPath,
                             fileLoc=args['asset_file_loc'],
                             filename=args['asset_file'].filename,
                             repo=repo_details)
        if not resp:
            logger.error('Failed to push to repository')            
            db.update(assetid=args['assetid'],
                      onboard_status='Repo upload Failed')
            publish_onboard_events(assetid=args['assetid'],
                                  onboard_status='Repo upload Failed',
                                  type='asset')
            os.remove(args['asset_file_loc'])
            return False
        (link, size) = resp
        size = format_bytes(int(size))        
        db.update(assetid=args['assetid'],
                  link=link,
                  size=size,
                  onboard_status='Done')
        publish_onboard_events(assetid=args['assetid'],
                              link=link,
                              size=size,
                              onboard_status='Done',
                              type='asset')
        os.remove(args['asset_file_loc'])
                        
def scanTestFile(args):
    try:
        resp = os.popen(f"clamscan {args['test_file_loc']}").read()
        if not "Infected files" in resp:
            return False
        return_val = \
            [int(item.split(':')[1].strip()) < 1 for item in resp.split('\n')
             if item.split(':')[0] == 'Infected files'][0]
        return return_val
    except Exception as e:
        logger.error(e)


def localTestOnboarding(args, repo_details):
    secured = scanTestFile(args)
    if not secured:
        logger.error('Insecured File. Aborting Test Onboarding.')        
        db.updateTest(testcaseid=args['test_id'],
                  scan_result='Vulnerable',
                  onboard_status='Aborted')
        publish_onboard_events(testcaseid=args['test_id'],
                               scan_result='Vulnerable',
                               onboard_status='Aborted',
                               type='tests')
        os.remove(args['test_file_loc'])
        return False    
    db.updateTest(testcaseid=args['test_id'],
              scan_result='Safe')
    publish_onboard_events(testcaseid=args['test_id'],
                       scan_result='Safe',type='tests')
    relTargetPath = f"{args['test_repository']}/{args['test_name']}/{args['test_category']}/" \
                    f"{args['test_file_name']}"
    resp = uploadToJfrog(relTargetPath=relTargetPath,
                             fileLoc=args['test_file_loc'],
                             filename=args['test_file'].filename,
                             repo=repo_details)
    if not resp:
        logger.error('Failed to push to repository')        
        db.updateTest(testcaseid=args['test_id'], onboard_status='Repo upload Failed')
        publish_onboard_events(testcaseid=args['test_id'],
                               onboard_status='Repo upload Failed',type='tests')
        os.remove(args['test_file_loc'])
        return False
    link, _ = resp    
    db.updateTest(testcaseid=args['test_id'],
                    link=link,
                    onboard_status='Done')
    publish_onboard_events(testcaseid=args['test_id'],
                              link=link,
                              onboard_status='Done',type='tests')
    os.remove(args['test_file_loc'])



