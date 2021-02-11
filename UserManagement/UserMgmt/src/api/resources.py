import datetime
import os
from ..db import db
from kubernetes import config, client
from ..lib.commonFunctions import *
from flask_restful import Resource, reqparse, inputs
from flask_jwt_extended import create_access_token, get_jwt_identity, \
    jwt_required


class IsAuthorized(Resource):


    # This endpoint is to verify whether the token user is authorised for the
    # service along with the permission type
    # Token provided to the user while user authentication needs to be passed
    # as Bearer token along with service,
    # and permission type.
    #@jwt_required
    def get(self, svc, perm):
        if perm not in ['read', 'write']:
            return {'message': 'Invalid permission type requested for'}, 400
        resp = db.verifyPermissions(get_jwt_identity(), svc, perm)
        if resp:
            return {'permission': 'granted'}, 200
        elif resp is False:
            return {'permission': 'denied'}, 401
        return {'message': 'Unable to verify permissions'}, 500


#class Authenticate(Resource):


#    def get(self):
#        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
#        parser.add_argument('username', type=nonEmptyEmail, location='authorization', required=True)
#        parser.add_argument('password', type=nonEmptyPasswString, location='authorization', required=True)
#        args = parser.parse_args()
#        if db.authenticateUser(args['username'], args['password']):
#            access_token = create_access_token(
#                identity=args['username'],
#                expires_delta=datetime.timedelta(minutes=120))
#            return {'admin_access': db.checkAdminPrivilege(args['username']),
#                    'token': access_token,
#                    'token expiry(UTC time)':
#                        (datetime.datetime.utcnow() + datetime.timedelta(
#                            minutes=120)).strftime('%m-%d-%Y %H:%M:%S')}, \
#                   200
#        return {'message': 'Invalid credentials'}, 500
#
#
#class SelfChanges(Resource):
    #@jwt_required
#    def put(self):
#        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
#        parser.add_argument('action', type=int, required=True, location='args')
#        args = parser.parse_args()
        # if args['email'] != get_jwt_identity():
        #     return {
        #                'message': 'The token provided is not for the user in '
        #                           'change request'}, 400
#        if args['action'] == 3:
#            parser.add_argument('new_password', type=nonEmptyPasswString,
#                                required=True)
#            args = parser.parse_args()
#            if db.changePass(get_jwt_identity(), args['password']):
#                return {'message': 'Password changed'}, 200
#        elif args['action'] == 4:
#            parser.add_argument('new_name', type=nonEmptyString, required=True)
#            args = parser.parse_args()
#            if db.changeuserName(get_jwt_identity(), args['name']):
#                return {'message': 'username modified'}, 200
#        return {'message': 'Unable to process the request'}, 500


#class SelfChanges(Resource):
#      def put(self):
#            parser.add_argument('new_name', type=nonEmptyString, required=True)
#            args = parser.parse_args()
#            if db.changeuserName(get_jwt_identity(), args['name']):
#                return {'message': 'username modified'}, 200
#            return {'message': 'Unable to process the request'}, 500
          


class User(Resource):


    # For all admin task requests, token generated while admin authentication
    # will only be accepted and must be
    # passed as bearer token .
    # passFormatMsg = "Password must be minimum 8 characters long and must \
    #     contain at least 1 uppercase, 1 lowercase character, 1 number \
    #         and 1 of the special characters <_@$>"

    # Getting List of user Available
    #@jwt_required
    #@admin_required
    def get(self):
        users = db.getUsers()
        if users:
            return users, 200
        if users is False:
            return {'msg': 'No users record found'}, 404
        return {'message': 'Unable to fetch users'}, 500

    # Creating user
    #@jwt_required
    #@admin_required
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('email', type=nonEmptyEmail, required=True)
        parser.add_argument('name', type=nonEmptyString, required=True)
#        parser.add_argument('password', type=nonEmptyPasswString, required=True)
        parser.add_argument('roles', action='append', required=True)
        args = parser.parse_args()
        if db.getUsers(args['email']):
            return {'message': 'User already exists'}, 400
        roles = formatList(args['roles'])
        if not isinstance(roles, list):
            return {'message': {'roles': roles}}, 400
#        resp = db.createUser(args['email'], args['name'], args['password'],
#                             roles)
        resp = db.createUser(args['email'], args['name'], roles)
        if resp:
            return {'message': 'User created'}, 200
        elif resp is False:
            return {"message": "Role/Roles does not exist"}, 500
        return {'message': 'Unable to create user '}, 500

    # Updating User details
    #@jwt_required
    #@admin_required
    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('email', type=nonEmptyEmail, required=True)
        parser.add_argument('action', type=int, required=True, location='args')
        args = parser.parse_args()
#        if args['action'] == 3:
#            parser.add_argument('password', type=nonEmptyPasswString,
#                                required=True)
#            args = parser.parse_args()
#            if db.changePass(args['email'], args['password']):
#                return {'message': 'Password changed'}, 200
        if args['action'] == 1:
            parser.add_argument('roles', action='append', required=True)
            args = parser.parse_args()
            roles = formatList(args['roles'])
            if not isinstance(roles, list):
                return {'message': {'roles': roles}}, 400
            if db.addRoleToUser(args['email'], roles) == 2:
                return {'message': 'Role(s) added to user'}, 200
            elif db.addRoleToUser(args['email'], roles) == 3:
                return {'message': 'Role(s) doesnt exist'}, 400            
            elif db.addRoleToUser(args['email'], roles) == 1:
                return {'message': 'Role(s) already associated with the user'}, 400
        
 	       
        elif args['action'] == 2:
            parser.add_argument('roles', action='append', required=True)
            args = parser.parse_args()
            roles = formatList(args['roles'])
            if not isinstance(roles, list):
                return {'message': {'roles': roles}}, 400
            if db.removeRoleFrmUser(args['email'], roles) == 3:
                return {'message': 'Role(s) removed from user'}, 200
            elif db.removeRoleFrmUser(args['email'], roles) == 1:
                return {'message': 'User doesn\'t have any of thse roles' }, 400
            elif db.removeRoleFrmUser(args['email'], roles) == 2:
                return {'message': 'Removing this role will remove all the roles for the User.User can be deleted if not being used'}, 400
        elif args['action'] == 4:
            parser.add_argument('name', type=nonEmptyString, required=True)
            args = parser.parse_args()
            if db.changeuserName(args['email'], args['name']):
                return {'message': 'username modified'}, 200
        return {'message': 'Unable to process the request'}, 500

    # Deleting user
    #@jwt_required
    #@admin_required
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('email', type=nonEmptyEmail, required=True)
        args = parser.parse_args()
        if db.deleteUser(args['email']):
            return {'message': 'User deleted'}, 200
        return {'message': 'User does not exist'}, 400


class Role(Resource):


    # For all admin task requests, token generated while admin authentication
    # will only be accepted and must be
    # passed as bearer token.
    # Getting List of role Available
    # @jwt_required
    # @admin_required
    def get(self):
        roles = db.getRoles()
        if roles:
            return roles, 200
        if roles is False:
            return {'msg': 'No roles record found'}, 404
        return {'message': 'Unable to fetch roles'}, 500

    # Creating Role
    #@jwt_required
    #@admin_required
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('role', type=nonEmptyString, required=True)
        parser.add_argument('services', action='append', required=True)
        parser.add_argument('access_type', choices=('read', 'write'),default='write')
        args = parser.parse_args()
        if db.getRoles(args['role']):
            return {'message': 'Role already exists'}, 400
        services = formatList(args['services'])
        if not isinstance(services, list):
            return {'message': {'services': services}}, 400
        resp = db.createRole(args['role'], services, args['access_type'])
        if resp:
            return {'message': 'Role Created'}, 200
        elif resp is False:
            return {'messages': 'All or one of the services not found'}, 412
        return {'message': 'Request not processed'}, 500

    # Adding Service to role
    #@jwt_required
    #@admin_required
    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('role', type=nonEmptyString, required=True)
        parser.add_argument('action', type=int, required=True, location='args')
        parser.add_argument('services', action='append', required=True)
        args = parser.parse_args()
        services = formatList(args['services'])
        if not isinstance(services, list):
            return {'message': {'services': services}}, 400
        if args['action'] == 1:
            if db.addSvcToRole(args['role'], services) == 2:
                return {'message': 'Service(s) added to role'}, 200
            elif db.addSvcToRole(args['role'], services) == 3:
                return {'message': 'Service(s) doesnt exist'}, 400            
            elif db.addSvcToRole(args['role'], services) == 1:
                return {'message': 'Service(s) already associated with the role'}, 400                 
            
        elif args['action'] == 2:
            if db.remSvcFrmRole(args['role'], services) == 2:
                return {'message': 'Service is removed from Role'}, 200
            elif db.remSvcFrmRole(args['role'], services) == 1:
                return {'message': 'Removing this will remove all the access for the role.Role can be deleted if not being used'}, 400
            elif db.remSvcFrmRole(args['role'], services) == 4:
                return {'message': 'Role doesnt have any of these services'}, 400
            elif db.remSvcFrmRole(args['role'], services) == 3:
                return {'message': 'One of the services not found'}, 400
        return {'message': 'Unable to process this request'}, 500

    # Deleting roles
    #@jwt_required
    #@admin_required
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('role', type=nonEmptyString, required=True)
        args = parser.parse_args()
        resp = db.deleteRole(args['role'])
        if resp:
            return {'message': 'Role is deleted'}, 200
        elif resp is False:
            return {'message': 'Role in use, cannot delete'}, 412
        return {'message': 'Role doesnt exist'}, 400


class Service(Resource):


    # For all admin task requests, token generated while admin authentication
    # will only be accepted and must be
    # passed as bearer token.
    # Getting list of Services
    #@jwt_required
    #@admin_required
    def get(self):
        svcs = db.getServices()
        if svcs:
            return svcs, 200
        if svcs is False:
            return {'msg': 'No services record found'}, 404
        return {'message': 'Unable to fetch services'}, 500

    # Creating Service
    #@jwt_required
    #@admin_required
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('service', type=nonEmptyString, required=True)
        parser.add_argument('status', choices=('enabled', 'disabled'),
                            default='disabled')
        parser.add_argument('endpoint', type=inputs.url, default='')
        args = parser.parse_args()
        if db.getServices(args['service']):
            return {'message': 'Service already exists'}, 400
        if db.createSvc(args['service'], args['status'], args['endpoint']):
            return {'message': 'Service is created'}, 200
        return {'message': 'Unable to process this request'}, 500

    # status change
    #@jwt_required
    #@admin_required
    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('service', type=nonEmptyString, required=True)
        parser.add_argument('status', choices=('enabled', 'disabled'),
                            required=True)
        args = parser.parse_args()
        done = db.changeServiceStatus(args['service'], args['status'])
        if done:
            return {'message': 'Service state is updated'}, 200
        if done is False:
            return {'message': 'Service not found'}, 400
        return {'message': 'Unable to process this request'}, 500

    # Deleting Service
    #@jwt_required
    #@admin_required
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('service', type=nonEmptyString, required=True)
        args = parser.parse_args()
        done = db.deleteSvcs(args['service'])
        if done:
            return {'message': 'Service is deleted'}, 200
        elif done is False:
            return {
                       'message': 'Service in use or does not exists, cannot '
                                  'delete'}, 412
        return {'message': 'Unable to process this request'}, 500
      
      
      
class Service(Resource):

    def get(self):
      config.load_incluster_config()
      v1 = client.CoreV1Api()
      ret = v1.list_namespaced_pod('ethan', watch=False)
      service_list = os.environ.get('service_list').split(',')
      for i in ret.items:
          check = (i.metadata.name.split('-'), i.status.phase)
          if (check[0][0]+ "-" + check[0][1]) in service_list:
              resp= db.changeServiceStatus(name=(check[0][0]+ "-" + check[0][1]), status=check[1])
              if not resp:
                return{"message": "Failed to update status"}, 500
      svcs = db.getServices()
      if svcs:
          return svcs, 200
      if svcs is False:
          return {'msg': 'No services record found'}, 404
      return {'message': 'Unable to fetch services'}, 500

