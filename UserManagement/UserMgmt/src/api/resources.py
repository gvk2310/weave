import datetime
import re
import os
from ..db import db
from kubernetes import config, client
from ..lib.commonFunctions import *
from flask_restful import Resource, reqparse, inputs
from flask_jwt_extended import create_access_token, get_jwt_identity, \
    jwt_required


class User(Resource):

    def get(self):
        users = db.getUsers()
        if users:
            return users, 200
        if users is False:
            return {'msg': 'No users record found'}, 404
        return {'message': 'Unable to fetch users'}, 500

    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('email', type=nonEmptyEmail, required=True,
                            nullable=False)
        parser.add_argument('name', type=nonEmptyString, required=True,
                            nullable=False)
        parser.add_argument('project', type=nonEmptyString, required=True,
                            nullable=False)
        parser.add_argument('roles', type=nonEmptyString, required=True,
                            nullable=False)
        args = parser.parse_args()
        args['name'] = args['name'].lower()
        args['roles'] = args['roles'].lower()
        if db.getUsers(email=args['email']):
            return {'message': 'User already exists'}, 400
        role = db.getRoles(args['roles'])
        if role is False:
            return {'message': "Given role doesn't exist"}, 400
        data = getProject(args['project'])
        if data is None:
            return {'message': 'Given Project doesnt exist'}, 400
        args['user_id'] = datetime.datetime.now().strftime("UR%Y%m%d%H%M%S")
        resp = db.createUser(user_id=args['user_id'],
                             name=args['name'],
                             email=args['email'],
                             project=args['project'],
                             roles=args['roles'])
        if resp:
            return {'message': 'User created'}, 200
        return {'message': 'Unable to create user '}, 500

    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('email', type=nonEmptyEmail, required=True,
                            nullable=False)
        parser.add_argument('roles', type=nonEmptyString, required=True,
                            nullable=False)
        parser.add_argument('project', type=nonEmptyString, required=True,
                            nullable=False)
        args = parser.parse_args()
        args['roles'] = args['roles'].lower()
        role = db.getUsers(email=args['email'])
        if (role['roles'] == args['roles'] and role['project'] == args[
            'project']):
            return {
                       'message': 'Role/project already associated with the user'}, 400
        else:
            data = db.getRoles(role=args['roles'])
            if data is False:
                return {'message': 'Role doesnt exist'}, 400
            data = getProject(args['project'])
            if data is None:
                return {'message': 'Project doesnt exist'}, 400
            resp = db.updateUserdetails(email=args['email'],
                                        project=args['project'],
                                        roles=args['roles'])
            if resp:
                return {'message': 'Role/project updated to user'}, 200
            else:
                return {
                           'message': 'Unable to update role/project from user'}, 400

    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('email', type=nonEmptyEmail, required=True)
        args = parser.parse_args()
        if db.deleteUser(args['email']):
            return {'message': 'User deleted'}, 200
        return {'message': 'User does not exist'}, 400


class Role(Resource):

    def get(self):
        roles = db.getRoles()
        if roles:
            return roles, 200
        if roles is False:
            return {'msg': 'No roles record found'}, 404
        return {'message': 'Unable to fetch roles'}, 500

    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('role', type=nonEmptyString, required=True)
        parser.add_argument('services', action='append', required=True)
        parser.add_argument('access_type', choices=('read', 'write'),
                            default='write')
        args = parser.parse_args()
        args['role'] = args['role'].lower()
        if db.getRoles(args['role']):
            return {'message': 'Role already exists'}, 400
        services = formatList(args['services'])
        if not isinstance(services, list):
            return {'message': {'services': services}}, 400
        resp = db.createRole(args['role'], services, args['access_type'])
        if resp:
            return {'message': 'Role Created'}, 200
        elif resp is False:
            return {'messages': 'Unable to create role'}, 412
        return {'message': 'Request not processed'}, 500

    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('role', type=nonEmptyString, required=True)
        parser.add_argument('services', action='append', required=True)
        args = parser.parse_args()
        args['role'] = args['role'].lower()
        services = formatList(args['services'])
        if not isinstance(services, list):
            return {'message': {'services': services}}, 400
        srvc = db.getRoles(args['role'])
        if srvc['access']['access_on'] == args['services']:
            return {
                       'message': 'Service(s) already associated with the role'}, 400
        svcs = [sub['name'] for sub in db.getServices()]
        svc_list = [svc for svc in args['services'] if svc not in svcs]
        if svc_list:
            return {f"Service(s) {svc_list} doesnt exist"}, 400
        resp = db.updateRoleSvcs(args['role'], args['services'])
        if resp:
            return {'message': 'Service(s) has been updated to the role'}, 200
        else:
            return {'message': 'Unable to update Service(s) to the role'}, 400

    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('role', type=nonEmptyString, required=True)
        args = parser.parse_args()
        args['role'] = args['role'].lower()
        data = db.getRoles(role=args['role'])
        if data is False:
            return {'message': 'Role doesnt exist'}, 400
        resp = db.deleteRole(args['role'])
        if resp:
            return {'message': 'Role is deleted'}, 200
        elif resp is False:
            return {'message': 'Role in use, cannot delete'}, 412
        return {'message': 'Request cant be processed'}, 500


class Service(Resource):

    def get(self):
        config.load_incluster_config()
        v1 = client.CoreV1Api()
        retp = v1.list_pod_for_all_namespaces(watch=False)
        service_list = os.environ.get('service_list').split(',')
        actual_plist = []
        for i in retp.items:
            result = re.findall("devnetops", i.metadata.name)
            if result == ['devnetops']:
                check = (i.metadata.name.split('-'), i.status.phase)
                if (check[0][0] + "-" + check[0][1]) in service_list:
                    actual_plist.append(check[0][0] + "-" + check[0][1])
                    resp = db.changePodStatus(
                        name=(check[0][0] + "-" + check[0][1]), status=check[1])
                    if not resp:
                        return {
                                   "message": "Failed to update the pod status "}, 500
        rets = v1.list_service_for_all_namespaces(watch=False)
        actual_slist = []
        for i in rets.items:
            if i.metadata.name in service_list:
                actual_slist.append(i.metadata.name)
                resp = db.changeServiceStatus(name=i.metadata.name,
                                              status='Running')
                if not resp:
                    return {
                               "message": "Failed to update the service status "}, 500
        end_points = endpoints()
        for i in service_list:
            for j in end_points:
                if i in j:
                    resp = db.changeServiceEndpoints(name=i, endpoints=j[:-3])
                    if not resp:
                        return {"message": "Failed to update endpoint URL"}, 500
        if (actual_plist != service_list):
            check = returnNotMatches(service_list, actual_plist)
            for items in check:
                resp = db.changePodStatus(name=items, status='Disabled')
                if not resp:
                    return {"message": "Failed to update pod_status"}, 500
                resp = db.changeServiceEndpoints(name=items, endpoints='None')
                if not resp:
                    return {"message": "Failed to update endpoint_URL"}, 500
        if (actual_slist != service_list):
            check = returnNotMatches(service_list, actual_slist)
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
        data = db.getUserSvcs(name=name)
        if data:
            return data, 200
        if data is None:
            return {'msg': 'No user record found'}, 404
        return {'msg': 'Internal Server Error'}, 500


class Access(Resource):
    def get(self, encoded_service_user, encoded_service_key):
        check = auth_user_details(encoded_service_user, encoded_service_key)
        if check is False:
            return 404
        token = create_token(encoded_service_user)
        if token:
            headers = [('Set-Cookie', f'token={token};HttpOnly;Secure')]
            return '', 200, headers
        return 500
