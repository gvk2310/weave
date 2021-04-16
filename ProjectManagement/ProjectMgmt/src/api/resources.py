import datetime
import re
import os
from ..db import db
from ..lib.commonFunctions import *
from flask_restful import Resource, reqparse, inputs

class Project(Resource):

    def get(self):
        project = db.getProject()
        if project:
            return project, 200
        if project is False:
            return {'msg': 'No projects record found'}, 404
        return {'message': 'Unable to fetch projects'}, 500

    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('project_name', type=nonEmptyString, required=True,
                            nullable=False)
        parser.add_argument('project_details', type=str, required=True, nullable=False)
        args = parser.parse_args()
        check = db.getProject(project_name=args['project_name'])
        if check is not False:
          if check['project_name'] == args['project_name']:
            return {'message': 'Project already exist'}, 400
        args['project_id'] = datetime.datetime.now().strftime("PR%Y%m%d%H%M%S")
        resp = db.createProject(project_id=args['project_id'],
                                project_name=args['project_name'],
                                project_details=args['project_details'])
        if resp:
            return {'message': 'Project Created'}, 200
        else:
            return {'messages': 'Unable to create project details'}, 412
        return {'message': 'Request not processed'}, 500

    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('project_name', type=nonEmptyString, required=True, nullable=False)
        parser.add_argument('project_details', type=str, required=True, nullable=False)
        args = parser.parse_args()
        check = db.getProject(project_name=args['project_name'])
        if check is False:
            return {'message': 'Project does not exist'}, 400
        if check['project_details'] == args['project_details']:
            return {'message': 'Project details already updated'}, 400
        done = db.updateProject(project_name=args['project_name'],
                                project_details=args['project_details'])
        if done:
            return {'message': 'Project details is updated'}, 200
        else:
            return {'message': 'Unable to update project details'}, 400
        return {'message': 'Unable to process this request'}, 500
      
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('project_name', type=nonEmptyString, required=True,nullable=False)
        args = parser.parse_args()
        check = db.getProject(project_name=args['project_name'])
        if check is False:
            return {'message': 'Project does not exist'}, 400
        done = db.deleteProject(project_name=args['project_name'])
        if done:
            return {'message': 'Project is deleted'}, 200
        if not done:
            return {'message': 'Unable to delete project'}, 412
        return {'message': 'Unable to process this request'}, 500
