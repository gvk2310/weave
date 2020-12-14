import re
from ..db import db
from flask_jwt_extended import get_jwt_identity
from functools import wraps


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
