import re
from ..db.db import createUser, modifyRoles, changePass, authenticateUser
from ..db.db import userRoles
from flask_restful import Resource, request
from functools import wraps


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = request.authorization['username']
        passw = request.authorization['password']
        if not authenticateUser(user, passw):
            return {'message': 'Invalid Admin Creds'}, 401
        if not (roles:=userRoles(user)):
            return {'message': "Unable to process request"}, 500
        elif 'admin' not in roles:
            return {'message': "Don't have adequate priviledge"}, 401
        return fn(*args, **kwargs)
    return wrapper


def passChecker(passw):
    if not len(passw) > 7 or not re.search('[A-Z]', passw)\
            or not re.search('[a-z]', passw) or not re.search('[0-9]', passw) \
            or not re.search('[_@$]', passw):
        return False
    return True


class User(Resource):
    passFormatMsg = \
        "Password must be minimum 8 characters long and must \
        contain atleast  -  1 uppercase, 1  lowercase character, 1 number \
            and 1 of the special symbol [_@$]"

    @admin_required
    def post(self):
        user = request.json['email']
        if not passChecker(request.json['password']):
            return {'message': passFormatMsg}, 417
        passw = request.json['password']
        roles = request.json['roles']
        if createUser(user, passw, roles):
            return {'message': 'User  created'}, 200
        return {'message': 'Unable to create user '}, 500

    @admin_required
    def put(self):
        user = request.json['email']
        action = request.json['action'].lower()
        if action == 'change_pass':
            if not passChecker(request.json['password']):
                return {'message': passFormatMsg}, 417
            passw = request.json['password']
            if changePass(user, passw):
                return {'message': 'Password changed'}, 200
        elif action in ['add_role', 'remove_role']:
            roles = request.json['roles']
            if modifyRoles(user, roles, action):
                return {'message': 'Roles modified'}, 200
        return {'message': 'Unable to process the request'}, 200

    @admin_required
    def delete(self):
        user = request.json['email']
        if deleteUser(user):
            return {'message': 'User  deleted'}, 200
        return {'message': 'Unable to create user'}, 500


class Authenticate(Resource):
    def get(self):
        user = request.authorization['username']
        passw = request.authorization['password']
        if authenticateUser(user, passw):
            return {'message': 'User Validated'}, 200
        return {'message': 'Invalid credentials'}, 500
