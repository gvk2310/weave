import datetime
import os
from ..db import db
from kubernetes import config, client
from ..lib.commonFunctions import *
from flask_restful import Resource, reqparse, inputs
from flask_jwt_extended import create_access_token, get_jwt_identity, \
    jwt_required



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
        parser.add_argument('roles', action='append', required=True)
        args = parser.parse_args()
        if db.getUsers(args['email']):
            return {'message': 'User already exists'}, 400
        roles = formatList(args['roles'])
        if not isinstance(roles, list):
            return {'message': {'roles': roles}}, 400
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

    def get(self):
      config.load_incluster_config()
      v1 = client.CoreV1Api()
      retp = v1.list_pod_for_all_namespaces(watch=False)
      service_list = os.environ.get('service_list').split(',')
      actual_plist= []
      for i in retp.items:
          check = (i.metadata.name.split('-'), i.status.phase)
          if (check[0][0]+ "-" + check[0][1]) in service_list:
              actual_plist.append(check[0][0]+ "-" + check[0][1])
              resp= db.changePodStatus(name=(check[0][0]+ "-" + check[0][1]), status=check[1])
              if not resp:
                return{"message": "Failed to update the pod status "}, 500
      rets = v1.list_service_for_all_namespaces(watch=False)
      actual_slist= []
      for i in rets.items:
          if i.metadata.name in service_list:
              actual_slist.append(i.metadata.name)
              resp= db.changeServiceStatus(name=i.metadata.name, status='Running')
              if not resp:
                return{"message": "Failed to update the service status "}, 500          
      end_points = endpoints()
      for i in service_list:
          for j in end_points:
            if i in j:
              resp = db.changeServiceEndpoints(name=i, endpoints=j[:-3])
              if not resp:
                return {"message": "Failed to update endpoint URL"}, 500
      if (actual_plist != service_list):
        check= returnNotMatches(service_list,actual_plist)
        for items in check:
          resp = db.changePodStatus(name=items, status='Disabled')
          if not resp:
            return {"message": "Failed to update pod_status"}, 500
          resp = db.changeServiceEndpoints(name=items, endpoints='None')
          if not resp:
            return {"message": "Failed to update endpoint_URL"}, 500
      if (actual_slist != service_list):
        check= returnNotMatches(service_list,actual_slist)
        for items in check:
          resp = db.changeServiceStatus(name=items, status='Disabled')
          if not resp:
            return {"message": "Failed to update service_status"}, 500
          resp = db.changeServiceEndpoints(name=items, endpoints='None')
          if not resp:
            return {"message": "Failed to update endpoint_URL"}, 500
      svcs = db.getServices()
      if svcs:
          return svcs, 200
      if svcs is False:
          return {'msg': 'No services record found'}, 404
      return {'message': 'Unable to fetch services'}, 500
    
class SingleUserInfo(Resource):
  def get(self, name):
  data = db.get(name=name)
  if data:
    return data, 200
  if data is False:
    return {'msg': 'No user record found'}, 404
  return {'msg': 'Internal Server Error'}, 500
