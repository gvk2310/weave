import re
import os
import base64
import traceback
import pymongo
from ..db import db
from Crypto.Cipher import AES
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from kubernetes import config, client
from ..log import logger
from ..config.auth_config import *

mongohost = os.environ['mongohost']


def getProject(project):
    try:
        client = pymongo.MongoClient(f"{mongohost}")
        db = client["devnetops"]
        collections = db["project"]
        projects = [item["project_name"] for item in collections.find()]
        if project in projects:
            return True
    except Exception as e:
        logger.error("Unable to get poject details")
        logger.debug(traceback.format_exc())
        logger.error(e)


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_jwt_identity()
        if not db.checkAdminPrivilege(user):
            return {'message': "Don't have adequate privilege"}, 401
        return fn(*args, **kwargs)

    return wrapper


def nonEmptyString(value):
    if isinstance(value, str) and value.strip() and re.match(
            r'^[\w\d\-_|]+$', value):
        return value
    else:
        raise ValueError(
            'The string value is either empty or not allowed. Alphanumeric '
            'string with special characters (-_) allowed')


def nonEmptyPasswString(value):
    if isinstance(value, str) and value.strip() and re.match(
            r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$_])[A-Za-z\d@$_]{8,20}$',
            value):
        return value
    else:
        raise ValueError(
            'Password must be minimum 8 characters long and must contain at '
            'least 1 uppercase, 1 lowercase character, 1 number and 1 of the '
            'special characters [_@$]')


def nonEmptyEmail(value):
    if isinstance(value, str) and value.strip() and re.match(
            r'^[A-Za-z\d\._-]+[@]\w+[.]\w+$', value):
        return value
    else:
        raise ValueError(
            'Invalid email provided')


def formatList(val):
    val = [item for item in val if item.strip()]
    if not val:
        return 'Empty list provided'
    for item in val:
        if not re.match(
                r'^[\w\d\-_|]+$', item):
            return 'One of the item in the list is an invalid string'
    return val


def returnNotMatches(service_list, actual_list):
    return [x for x in service_list if x not in actual_list]


def endpoints():
    try:
        end_points = []
        config.load_incluster_config()
        v1 = client.CoreV1Api()
        ret = v1.list_config_map_for_all_namespaces(watch=False)
        for i in ret.items:
            if (i.metadata.name == "nginx-conf"):
                lines = i.data
        str_lines = str(lines)
        lines = str_lines.split()
        for line in lines:
            split_devnetops = re.findall("devnetops", line)
            if split_devnetops == ['devnetops']:
                end_point = line
                end_points.append(end_point)
        return end_points
    except Exception as e:
        logger.error('Unable to get endpoints from kubernetes')
        logger.error(e)


def auth_user_details(encoded_service_user, encoded_service_key):
    try:
        user = base64.b64decode(encoded_service_user).decode("utf8")
        key = base64.b64decode(encoded_service_key).decode("utf8")
        if user == INITIAL_ADMIN_USER and key == INITIAL_ADMIN_PASSWORD:
            return True
        else:
            return False
    except Exception as e:
        logger.error('Unable to authenticate user details')
        logger.error(e)


def create_token(encoded_service_user):
    try:
        aes = AES.new(base64.b64decode(MYWD_KEY), AES.MODE_CFB,
                      base64.b64decode(MYWD_IV))
        return aes.encrypt(base64.b64decode(encoded_service_user))
    except Exception as e:
        logger.error('Unable to create token')
        logger.error(e)
