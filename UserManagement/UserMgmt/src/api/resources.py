import os
import re
import datetime
from ..db import db
from flask_restful import Resource, request
from functools import wraps
from flask_jwt_extended import create_access_token, get_jwt_identity, \
    jwt_required

request_header = {
    item.split('/')[0]: item.split('/')[1]
    for item in os.environ['request_header'].split(';')
}



def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # print(get_jwt_identity())
        user = get_jwt_identity()
        if not db.checkAdminPrivilege(user):
            return {'message': "Don't have adequate privilege"}, 401
        return fn(*args, **kwargs)

    return wrapper


def passChecker(passw):
    if not len(passw) > 7 or \
            not re.search('[A-Z]', passw) or \
            not re.search('[a-z]', passw) or \
            not re.search('[0-9]', passw) or \
            not re.search('[_@$]', passw):
        return False
    return True


def validStrChecker(string):
    regex = re.compile('[@!#$%^&*()<>?/\|}{~:]')
    if(regex.search(string) == None):
        print("String is accepted")
        return True
    else:
        print("String is not accepted.")
        return False
    

class IsAuthorized(Resource):
    # This endpoint is to verify whether the token user is authorised for the
    # service along with the permission type.
    # Token provided to the user while user authentication needs to be passed
    # as Bearer token along with service,
    # and permission type.
    @jwt_required
    def get(self, svc, perm):
        resp = db.verifyPermissions(get_jwt_identity(), svc, perm)
        if resp:
            return {'permission': 'granted'}, 200, request_header
        elif resp is False:
            return {'permission': 'denied'}, 401, request_header
        return {'message': 'Unable to verify permissions'}, 500, request_header


class Authenticate(Resource):
    def get(self):
        user = request.authorization['username']
        passw = request.authorization['password']
        if db.authenticateUser(user, passw):
            access_token = create_access_token(
                identity=user,
                expires_delta=datetime.timedelta(minutes=120))
            return {'token': access_token,
                    'token expiry(UTC time)':
                        (datetime.datetime.utcnow() + datetime.timedelta(
                            minutes=120)).strftime('%m-%d-%Y %H:%M:%S')}, \
                200, request_header
        return {'message': 'Invalid credentials'}, 500, request_header


class User(Resource):
    # For all admin task requests, token generated while admin authentication
    # will only be accepted and must be
    # passed as bearer token .
    passFormatMsg = "Password must be minimum 8 characters long and must \
        contain at least 1 uppercase, 1 lowercase character, 1 number \
            and 1 of the special characters <_@$>"

    # Getting List of user Available
    @jwt_required
    @admin_required
    def get(self):
        print(get_jwt_identity())
        users = db.getUsers()
        if users:
            return users, 200, request_header
        return {'message': 'Unable to fetch users'}, 500, request_header

    # Creating user
    @jwt_required
    @admin_required
    def post(self):
        user = request.json['email']
        name = request.json['name']
        passw = request.json['password']
        if not passChecker(passw):
            return {'message': self.passFormatMsg}, 417, request_header
        roles = request.json['roles']
        resp = db.createUser(name, user, passw, roles)
        if resp:
            return {'message': 'User  created'}, 200, request_header
        elif resp is False:
            return {"message": "Role/Roles does not exist"}, 500, \
                request_header
        return {'message': 'Unable to create user '}, 500, request_header

    # Updating User details
    @jwt_required
    @admin_required
    def put(self):
        user = request.json['email']
        action = int(request.args['action'])
        if action == 3:
            passw = request.json['password']
            if not passChecker(passw):
                return {'message': self.passFormatMsg}, 417, request_header
            if db.changePass(user, passw):
                return {'message': 'Password changed'}, 200, request_header
        elif action == 1:
            roles = request.json['roles']
            if db.addRoleToUser(user, roles):
                return {'message': 'Roles modified'}, 200, request_header
        elif action == 2:
            roles = request.json['roles']
            if db.removeRoleFrmUser(user, roles):
                return {'message': 'Roles modified'}, 200, request_header
        elif action == 4:
            name = request.json['name']
            if db.changeuserName(user, name):
                return {'message': 'username modified'}, 200, request_header
        return {'message': 'Unable to process the request'}, 500, \
            request_header

    # Deleting user
    @jwt_required
    @admin_required
    def delete(self):
        if 'email' not in request.json.keys() or \
                len(request.json['email']) < 1:
            return {'message': 'user name can not be blank'}, 422, \
                request_header
        # user = request.json['email']
        if db.deleteUser(request.json['email']):
            return {'message': 'User deleted'}, 200, request_header
        return {'message': 'Unable to delete user'}, 500, request_header


class Role(Resource):
    # For all admin task requests, token generated while admin authentication
    # will only be accepted and must be
    # passed as bearer token.
    # Getting List of role Available
    @jwt_required
    @admin_required
    def get(self):
        roles = db.getRoles()
        if roles:
            return roles, 200, request_header
        return {'message': 'Unable to fetch roles'}, 500, request_header

    # Creating Role
    @jwt_required
    @admin_required
    def post(self):
        role = request.json['role'].strip()
        if not validStrChecker(role) or 'role' not in request.json.keys() or len(role) < 1:
            return {'message': 'Role name cannot be blank or special characters'}, 422, \
                request_header
        role = request.json["role"].strip()
        read = []
        write = []
        if 'read' in request.json.keys():
            read = request.json["read"].strip()
        if 'write' in request.json.keys():
            write = request.json["write"].strip()
        resp = db.createRole(role, read, write)
        if resp:
            return {'message': 'Role Created'}, 200, request_header
        elif resp is False:
            return {'messages': 'Services not found'}, 412, request_header
        return {'message': 'Request not processed'}, 500, request_header

    # Adding Service to role
    @jwt_required
    @admin_required
    def put(self):
        if 'role' not in request.json.keys() or 'action' not in \
                request.args.keys() or \
                ('read' not in request.json.keys() and 'write' not in
                 request.json.keys()):
            return {'message': 'Missing fields! mandatory fields - action, '
                               'role and atleast one of read, write'}, 422, \
                request_header
        role = request.json['role']
        read = []
        write = []
        if 'read' in request.json.keys():
            read = request.json['read']
            print(read)
        if 'write' in request.json.keys():
            write = request.json['write']
            print(write)
        if len(read + write) < 1:
            return {'message': 'No services provided to process on'}, 422, \
                request_header
        action = int(request.args['action'])
        if action == 1:
            resp = db.addSvcToRole(role, read, write)
            if resp:
                return {'message': 'Services has been added to Role'}, 200, \
                    request_header
            elif resp is False:
                return {'message': 'Services not found'}, 400, request_header
        elif action == 2:
            if db.remSvcFrmRole(role, read, write):
                return {'message': 'Service is removed from Role'}, 200, \
                    request_header
        return {'message': 'Unable to process this request'}, 500, \
            request_header

    # Deleting roles
    @jwt_required
    @admin_required
    def delete(self):
        if 'role' not in request.json.keys() or len(request.json['role']) < 1:
            return {'message': 'role name cannot be blank'}, 422, \
                request_header
        resp = db.deleteRole(request.json['role'])
        if resp:
            return {'message': 'Role is deleted'}, 200, request_header
        elif resp is False:
            return {'message': 'Role in use, cannot delete'}, 412, \
                request_header
        return {'message': 'Unable to process this request'}, 500, \
            request_header


class Service(Resource):
    # For all admin task requests, token generated while admin authentication
    # will only be accepted and must be
    # passed as bearer token.
    # Getting list of Services
    @jwt_required
    @admin_required
    def get(self):
        svcs = db.getServices()
        if svcs:
            return {'Services': svcs}, 200, request_header
        return {'message': 'Unable to fetch services'}, 500, request_header

    # Creating Service
    @jwt_required
    @admin_required
    def post(self):
        name = request.json['name'].strip()
        if not validStrChecker(name) or 'name' not in request.json.keys() or len(name) < 1:
            return {'message': 'service name cannot be blank or special characters'}, 422, \
                request_header
        endpoint = request.json['endpoint'] if 'endpoint' in request.json.keys() else ""        
        if db.createSvc(name, endpoint):
            return {'message': 'Service is created'}, 200, request_header
        return {'message': 'Unable to process this request'}, 500, \
            request_header
      
    # Deleting Service
    @jwt_required
    @admin_required
    def delete(self):
        if 'name' not in request.json.keys() or len(request.json['name']) < 1:
            return {'message': 'service name cannot be blank'}, 422, \
                request_header
        serve = db.deleteSvcs(request.json['name'])
        if serve:
            return {'message': 'Service is deleted'}, 200, request_header
        elif serve is False:
            return {'message': 'Service in use or does not exists, cannot delete'}, 412, \
                request_header
        return {'message': 'Unable to process this request'}, 500, \
            request_header

    # status change
    @jwt_required
    @admin_required
    def put(self):
        name = request.json['name']
        if not validStrChecker(name) or 'name' not in request.json.keys() or len(request.json['name']) < 1:
            return {'message': 'service name cannot be blank or special characters'}
        if 'state' not in request.json.keys() or\
                len(request.json['state']) < 1:
            return {'message': 'state field can not be blank'}
        if db.changeServiceStatus(request.json['name'], request.json['state'], 
        request.json['endpoint']):
            return {'message': 'service state is updated'}, 200
        return {'message': 'Unable to process this request'}, 500
