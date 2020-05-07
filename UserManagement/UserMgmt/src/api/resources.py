import re
import datetime
from ..db import db
from flask_restful import Resource, request
from functools import wraps
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
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


class IsAuthorized(Resource):
    #This endpoint is to verify whether the token user is authorised for the service along with the permission type.
    #Token provided to the user while user authentication needs to be passed as Bearer token along with service,
    #and permission type.
    @jwt_required
    def get(self):
        svc = request.args['svc']
        perm = request.args['perm']
        if resp := db.verifyPermissions(get_jwt_identity(), svc, perm):
            return {'permission': 'granted'}, 200
        elif resp == False:
            return {'permission': 'denied'}, 401
        return {'message': 'Unable to verify permissions'}, 500


class Authenticate(Resource):
    def get(self):
        user = request.authorization['username']
        passw = request.authorization['password']
        if db.authenticateUser(user, passw):
            access_token = create_access_token(identity=user, expires_delta=datetime.timedelta(minutes=120))
            return {'token': access_token,
                    'token expiry(UTC time)':
                        (datetime.datetime.utcnow()+datetime.timedelta(minutes=120)).strftime('%m-%d-%Y %H:%M:%S')}, 200
        return {'message': 'Invalid credentials'}, 500


class User(Resource):
    #For all admin task requests, token generated while admin authentication will only be accepted and must be
    # passed as bearer token .
    passFormatMsg = "Password must be minimum 8 characters long and must \
        contain at least 1 uppercase, 1 lowercase character, 1 number \
            and 1 of the special characters <_@$>"
    # Getting List of user Available
    @admin_required
    @jwt_required
    def get(self):
        if users := db.getUsers():
            return users, 200
        return {'message': 'Unable to fetch users'}, 500
        
    # Creating user
    @admin_required
    @jwt_required
    def post(self):
        user = request.json['email']
        name = request.json['name']
        if not passChecker((passw := request.json['password'])):
            return {'message': self.passFormatMsg}, 417
        roles = request.json['roles']
        if (resp := db.createUser(name, user, passw, roles)) == True:
            return {'message': 'User  created'}, 200
        elif resp == False:
            return {"message": "Role/Roles does not exist"}, 500
        return {'message': 'Unable to create user '}, 500

    # Updating User details
    @admin_required
    @jwt_required
    def put(self):
        user = request.json['email']
        if (action := int(request.args['action'])) == 3:
            if not passChecker(passw := request.json['password']):
                return {'message': self.passFormatMsg}, 417
            if db.changePass(user, passw):
                return {'message': 'Password changed'}, 200
        elif action == 1:
            roles = request.json['roles']
            if db.addRoleToUser(user, roles):
                return {'message': 'Roles modified'}, 200
        elif action == 2:
            roles = request.json['roles']
            if db.removeRoleFrmUser(user, roles):
                return {'message': 'Roles modified'}, 200
        elif action == 4:
            name = request.json['name']
            if db.changeuserName(user, name):
                return {'message': 'username modified'}, 200      
        return {'message': 'Unable to process the request'}, 500

    # Deleting user
    @admin_required
    @jwt_required
    def delete(self):
        if 'email' not in request.json.keys() or len(user:=request.json['email'])<1:
            return {'message': 'user name can not be blank'}
        #user = request.json['email']
        if db.deleteUser(user):
            return {'message': 'User deleted'}, 200
        return {'message': 'Unable to delete user'}, 500


class Role(Resource):
    #For all admin task requests, token generated while admin authentication will only be accepted and must be
    # passed as bearer token.
    #Getting List of role Available
    @admin_required
    @jwt_required
    def get(self):
        if roles := db.getRoles():
            return roles, 200
        return {'message': 'Unable to fetch roles'}, 500

    # Creating Role
    @admin_required
    @jwt_required
    def post(self):
        role = request.json["role"]
        read=[]
        write=[]
        if 'read' in request.json.keys():
            read = request.json["read"]
        if 'write' in request.json.keys():
            write = request.json["write"]
        if (resp := db.createRole(role, read, write)) == True:
            return {'message': 'Role Created'}, 200
        elif resp == False:
            return {'messages': 'Services not found'}, 412
        return {'message': 'Request not processed'}, 500

    # Adding Service to role
    @admin_required
    @jwt_required
    def put(self):
        if 'role' not in (keys := request.json.keys()) or 'action' not in request.args.keys() or\
        ('read' not in keys and 'write' not in keys):
            return {'message': 'Missing fields! mandatory fields - action, role and atleast one of read, write'}
        role = request.json['role']
        read=[]
        write=[]
        if 'read' in request.json.keys():
            read = request.json['read']
            print(read)
        if 'write' in request.json.keys():
            write = request.json['write']
            print(write)
        if len(read+write)<1:
            return {'message': 'No services provided to process on'}
        if (action := int(request.args['action'])) == 1:
                if resp := db.addSvcToRole(role, read, write):
                    return {'message': 'Services has been added to Role'}, 200
                elif resp == False:
                    return {'message': 'Services not found'}, 400
        elif action == 2:
            if db.remSvcFrmRole(role, read, write):
                return {'message': 'Service is removed from Role'}, 200
        return {'message': 'Unable to process this request'}, 500                              
        

    # Deleting roles
    @admin_required
    @jwt_required
    def delete(self):
        if 'role' not in request.json.keys() or len(role:=request.json['role'])<1:
            return {'message': 'role name can not be blank'}    
        if resp := db.deleteRole(role):
            return {'message': 'Role is deleted'}, 200
        elif resp == False:
            return {'message': 'Role in use, cannot delete'}, 412
        return {'message': 'Unable to process this request'}, 500


class Service(Resource):
    #For all admin task requests, token generated while admin authentication will only be accepted and must be
    # passed as bearer token.
    # Getting list of Services
    @admin_required
    @jwt_required
    def get(self):
        if svcs := db.getServices():
            return {'Services': svcs}, 200
        return {'message': 'Unable to fetch services'}, 500

    # Creating Service
    @admin_required
    @jwt_required
    def post(self):
        if 'name' not in request.json.keys() or len(serviceName:=request.json['name'])<1:
            return {'message': 'service name can not be blank'}
        if db.createSvc(serviceName):
            return {'message': 'Service is created'}, 200
        return {'message': 'Unable to process this request'}, 500

    # Deleting Service
    @admin_required
    @jwt_required
    def delete(self):
        if 'name' not in request.json.keys() or len(serviceName:=request.json['name'])<1:
            return {'message': 'service name can not be blank'}
        if serve := db.deleteSvcs(serviceName):
            return {'message': 'Service is deleted'}, 200
        elif serve == False:
            return {'message': 'Service in use, cannot delete'}, 412
        return {'message': 'Unable to process this request'}, 500
