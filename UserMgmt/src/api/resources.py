import re
from ..db.db import authenticateUser
#from ..db.db import userRoles
from ..db import db
from flask_restful import Resource, request
from functools import wraps


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = request.authorization['username']
        passw = request.authorization['password']
        if not authenticateUser(user, passw):
            return {'message': 'Invalid Admin Creds'}, 401
        '''if not (roles:=db.userRoles(user)): 
            return {'message': "Unable to process request"}, 500
        elif 'admin' not in roles:
            return {'message': "Don't have adequate priviledge"}, 401'''
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
    # Creating user
    @admin_required
    def post(self):
        user = request.json['email']
        if not passChecker((passw:=request.json['password'])):
            return {'message': passFormatMsg}, 417
        #passw = request.json['password']
        roles = request.json['roles']
        if False:#roles not in db.getRoles():
       # if roles not in db.getRoles(): 
            return {'message':'Role is not exist'},500
        if db.createUser(user, passw, roles):
            return {'message': 'User  created'}, 200
        return {'message': 'Unable to create user '}, 500

     # Updating User details 
    @admin_required
    def put(self):
        user = request.json['email']
        action = request.json['action'].lower()
        if action == 'change_pass':
            if not passChecker(request.json['password']):
                return {'message': passFormatMsg}, 417
            passw = request.json['password']
            if db.changePass(user, passw):
                return {'message': 'Password changed'}, 200
        elif action in ['add_role', 'remove_role']:
            roles = request.json['roles']
            if db.modifyRoles(user, roles, action):
                return {'message': 'Roles modified'}, 200
        return {'message': 'Unable to process the request'}, 200

     # Deleting user
    @admin_required
    def delete(self):
        user = request.json['email']
        if db.deleteUser(user):
            return {'message': 'User  deleted'}, 200
        return {'message': 'Unable to create user'}, 500


class Authenticate(Resource):
    def get(self):
        user = request.authorization['username']
        passw = request.authorization['password']
        if db.authenticateUser(user, passw):
            return {'message': 'User Validated'}, 200
        return {'message': 'Invalid credentials'}, 500

class Role(Resource):

    # Creating Role
    @admin_required
    def post(self):
        role = request.json["role"]
        read = request.json["read"]
        write = request.json["write"]
        if db.createRole(role,read,write):
            return {'message': 'Role Created'}, 200
        return {'message': 'Request not processed'}, 500   

    # Getting Roles
    @admin_required
    def get(self):
        roles=db.getRoles()
        print(roles)
        if roles is not None:
            return roles, 200
        return{'message': 'Unable to process this request'}, 500  

     # Adding Service to role
    @admin_required
    def put(self):
        role = request.json['role']  
        permType = request.json['permType']  
        svcs = request.json['svcs']
        action=int(request.json['action']) # 1 for add , 2 delete 
        if action==1:
            if db.addSvcToRole(role,permType,svcs):
                return {'message': 'Service is added to Role'}, 200
        else:
            if db.remSvcFrmRole(role,permType,svcs):
                print("testtt")
                return {'message': 'Service is deleted to Role'}, 200
        return {'message': 'Unable to process this request'}, 500 

  #  @admin_required
  #  def put(self):
  #      role = request.json['role']  
  #      permType = request.json['permType']  
  #      svcs = request.json['svcs']
  #      if db.remSvcFrmRole(role,permType,svcs):
   #         return {'message': 'Service is removed from the Role'}, 200
   #     return {'message': 'Unable to procees this request'}, 500 

     # Deleting roles
    @admin_required
    def delete(self):
        role = request.json['role']
        if db.deleteRole(role):
            return {'message': 'Role is deleted'}, 200
        return {'message': 'Unable to process this request'}, 500


class Service(Resource):
     
    # Getting list of Services
    @admin_required
    def get(self):
        get_service=db.getServices()
        if get_service is not None:
            return get_service, 200
        return {'message': 'Unable to process this request'}, 500

    # Creating Service
    @admin_required
    def post(self):
        serviceName = request.json['serviceName'] 
        if db.createSvc(serviceName):
            return {'message': 'Service is created'}, 200
        return {'message': 'unable to process this request'}, 500

     # Deleting Service
    @admin_required
    def delete(self):
        svc = request.json['svc'] 
        if db.deleteSvcs(svc):
            return {'message': 'Service is deleted'}, 200
        return {'message': 'unable to process this request'}, 500                


