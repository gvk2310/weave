import re
import requests
from flask_restful import request
from functools import wraps
from ..config.config import token_auth_url



def nonEmptyString(value):
    if isinstance(value, str) and value.strip() and re.match(
            r'^[\w\d\-_|]+$', value):
        return value
    else:
        raise ValueError(
            'The string value is either empty or not allowed. Alphanumeric '
            'string with special characters (-_) allowed')


def formatList(val):
    val = [item for item in val if item.strip()]
    if not val:
        return 'Empty list provided'
    for item in val:
        if not re.match(
                r'^[\w\d\-_|]+$', item):
            return 'One of the item in the list is an invalid string'
    return val


def verify_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        resp = requests.get(f"{token_auth_url}/isvalidrequest",
                            cookies=request.cookies)
        if resp.status_code != 200:
            return resp.json(), resp.status_code
        return func(*args, **kwargs)
    return wrapper
