import re
import jwt
import base64
import datetime
import uuid
import pymongo
import traceback
from ..log import logger
from functools import wraps
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from kubernetes import config, client
from flask_restful import request
from ..config.config import mywd_iv, mywd_key, service_user, service_key, \
    mongohost, jwt_secret


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


def nonEmptyString(value):
    if isinstance(value, str) and value.strip() and re.match(
            r'^[\w\d\-_=|]+$', value):
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


def encrypted(var):
    try:
        aes = AES.new(mywd_key, AES.MODE_CBC, mywd_iv)
        return base64.urlsafe_b64encode(aes.encrypt(pad(var.encode('utf-8'), 16))).decode('utf-8')
    except Exception as e:
        logger.error(f'Failed to encrypt data: {var}')
        logger.error(e)


def decrypted(var):
    try:
        aes = AES.new(mywd_key, AES.MODE_CBC, mywd_iv)
        return unpad(aes.decrypt(base64.urlsafe_b64decode(var)), 16).decode('utf-8')
    except Exception as e:
        logger.error(f'Failed to decrypt data: {var}')
        logger.error(e)


def validate_service_user(encoded_service_user, encoded_service_key):
    return service_user == decrypted(encoded_service_user) and service_key == decrypted(
        encoded_service_key)


def create_token(encoded_service_user):
    iat = datetime.datetime.now()
    exp = iat + datetime.timedelta(hours=1)
    token_data = {
        "jti": str(uuid.uuid4()),
        "sub": decrypted(encoded_service_user),
        "iat": int(iat.timestamp()),
        "nbf": int(iat.timestamp()),
        "exp": int(exp.timestamp())
    }
    token = jwt.encode(token_data, jwt_secret, algorithm="HS512").decode('ascii')
    return encrypted(token)


def authenticated(encrypted_token):
    try:
        token = decrypted(encrypted_token)
        if not token:
            return '', "Invalid Token"
        head = jwt.get_unverified_header(token)
        return True, jwt.decode(token, jwt_secret, algorithms=head['alg'])
    except Exception as e:
        return '', e.args[0]


def verify_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'DnopsToken' not in request.cookies.keys():
            return {"error": "Access Denied"}, 400
        token = request.cookies['DnopsToken']
        status, resp = authenticated(token)
        if not status:
            return {"error": "Access Denied"}, 400
        return func(*args, **kwargs)
    return wrapper
