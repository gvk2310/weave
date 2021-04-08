from ..db import db
from flask import Response
from ..lib.awsFunctions import *
from ..lib.commonFunctions import *
from flask_restful import Resource, reqparse, inputs
from ..lib.sse import publish_event_message


class SingleDeployInfo(Resource):


    #@verifyToken
    def get(self, id):
        data = db.get(id=id)
        if data:
            return data, 200
        if data is False:
            return {'msg': 'No deployments record found'}, 404
        return {'msg': 'Internal Server Error'}, 500


class Deploy(Resource):


    #@verifyToken
    def get(self):
        data = db.get()
        if data:
            return data, 200
        if data is False:
            return {'msg': 'No deployments record found'}, 404
        return {'msg': 'Internal Server Error'}, 500

    #@verifyToken
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('name', type=nonEmptyString, required=True)
        parser.add_argument('type', type=nonEmptyString, required=True)
        parser.add_argument('environment', type=nonEmptyString, required=True)
        parser.add_argument('infra', type=nonEmptyString, required=True)
        parser.add_argument('orchestrator', type=nonEmptyString, required=True)
        parser.add_argument('assets', type=str, required=True)
        parser.add_argument('config', type=excelFileType, location='files',
                            required=True)
        args = parser.parse_args()
        if not checkStringLength(args['name']):
            return {'message': 'Deployment name cannot have more than 25 characters'}, 422
        invalid_choices = {}
        if args['type'] not in ('generic', 'versa'):
            invalid_choices['type'] = f"'{args['type']}' is not a valid choice"
        if args['environment'] not in (
                'dev', 'test', 'stage', 'production', 'demo'):
            invalid_choices[
                'environment'] = f"'{args['environment']}' is not a valid " \
                                 f"choice"
        if args['orchestrator'] not in ('cloudformation'):
            invalid_choices[
                'orchestrator'] = f"'{args['orchestrator']}' is not a valid " \
                                  f"choice"
        if invalid_choices:
            return {"msg": invalid_choices}, 400
        assets = {item.split('=')[0]: item.split('=')[1].split(',')
        if ',' in item.split('=')[1] else item.split('=')[1] for item in
                  args['assets'].split(';')}
        if args['type'] == 'versa':
            parser.add_argument('director_ip', type=inputs.url, required=True)
            parser.add_argument('controller_ip', type=inputs.url, required=True)
            args = parser.parse_args()

        if args['orchestrator'] == 'cloudformation' and args['type'] in [
            'generic', 'versa']:
            if 'template' not in assets or isinstance(assets['template'], list):
                return {
                           "msg": "Template not provided in assets or "
                                  "multiple Template id provided"}, 400
            data = assetDownloadDetails(assets['template'])
            if not data:
                return {"msg": "Unable to get template download details"}, 400
            template = data[0]
            config = createConfigJson(args['config'], args['infra'], template)
            if config == 1001:
                return {"msg": "Config parameters verification failed"}, 400
            if config == 1002:
                return {"msg": "Error retrieving Infra details"}, 400
            if config is None:
                return {"msg": "Unable to save config details"}, 500
            check = db.check_deployment(name=args['name'],
                                        orchestrator=args['orchestrator'],
                                        infra=args['infra'],
                                        config={k: v for k, v in config.items()
                                                if
                                                k != 'defaults'}
                                        )
            if check == 1001:
                return {"msg": "Deployment with same config already "
                               "exists"}, 400
            if check == 1002:
                return {"msg": "Deployment with same name already exists"}, 400
            if not check:
                return {"msg": "Failed to validate the request"}, 500

            timestamp = triggerDeployment(args, config, template)
            if not timestamp:
                return {"msg": "Stack creation failed"}, 500
            id = timestamp.strftime("DP%Y%m%d%H%M%S")
            configurations = {'config': {k: v for k, v in config.items() if
                                      k != 'defaults'}}
            if args['type'] == 'versa':
                configurations.update({'director_ip': args['director_ip'],
                                       'controller_ip': args['controller_ip']})
            check = db.create(id=id,
                              name=args['name'],
                              environment=args['environment'],
                              infra=args['infra'],
                              orchestrator=args['orchestrator'],
                              type=args['type'],
                              assets=assets,
                              configurations=configurations,
                              timestamp=timestamp)
            if check:
                return {"Deployment Name": args['name'],
                        "Deployment Id": id}, 200
            if check is False:
                return {"msg": "Deployment with same configurations already "
                               "exists"}, 400
            return {"msg": "Deployment triggered but failed to save "
                           "deployment details"}, 500

    #@verifyJenkins
    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('deployment_id', type=nonEmptyString, required=True)
        parser.add_argument('status', type=nonEmptyString, required=True)
        parser.add_argument('message', type=str, required=True)
        parser.add_argument('stage_info', type=dict, default=None)
        parser.add_argument('instances', type=dict, action="append")
        args = parser.parse_args()
        if args['instances'] == []:
            args['instances'] = None
        if args['status'] == 'DELETE_FAILED':
                publish_event_message(payload={'id':args['deployment_id'],
                                               'status':'DELETE_FAILED',
                                               'message':'Deployment deletion failed'})
        if args['status'] == "DELETE_COMPLETE":
            publish_event_message(payload={'id':args['deployment_id'],
                                               'status':'DELETE_COMPLETE',
                                               'message':'Deployment deletion completed'})
            done = db.delete(id=args['deployment_id'])
            
        else:
            done = db.update(id=args['deployment_id'],
                             status=args['status'],
                             message=args['message'],
                             stage_info=args['stage_info'],
                             instances=args['instances'])
        if done:
            publish_event_message(payload={'id':args['deployment_id'],
                             'status':args['status'],
                             'message':args['message'],
                             'stage_info':args['stage_info']})
            return {"msg": "Deploy status updated"}, 200
        if done is False:
            return {"msg": "Deployment Id does not exist"}, 400
        return {"msg": "Deployment update failed"}, 500

    #@verifyToken
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('id', type=nonEmptyString, required=True)
        parser.add_argument('force_delete', type=inputs.boolean, default=False)
        args = parser.parse_args()
        depl = db.get(id=args['id'])
        if not depl:
            return {"msg": "Deployment not found"}, 400
        if not args['force_delete'] and depl['status'] == 'DELETE_IN_PROGRESS':
            return {"msg": "Previous delete request already in process"}, 400
        if not args['force_delete'] and not depl['instances']:
            return {"msg": "No Instance details found"}, 400
        if depl['instances'] and depl['status'] not in \
                ['DELETE_IN_PROGRESS']:
            done = deleteDeployment(depl)
            if not done and not args['force_delete']:
                return {"msg": "Deployment could not be deleted from the "
                               "infrastructure"}, 500
        if args['force_delete']:
            done = db.delete(id=args['id'])
            if done:
                return {
                           "msg": "Deployment deleted. Please check manually "
                                  "if the instances have been properly deleted "
                                  "from the respective infrastructure"}, 200
        else:
            done = db.update(id=args['id'],
                             status='DELETE_IN_PROGRESS',
                             message='Deployment deletion initiated',
                             stage_info=None,
                             instances=None)
            if done:
                publish_event_message(payload={'id':args['id'],
                                             'status':'DELETE_IN_PROGRESS',
                                             'message':'Deployment deletion initiated'})
                return { "msg": "Deployment deletion initiated"}, 200
        return {"msg": "Deployment deletion failed"}, 500


class ConfigSpreadsheetGenerator(Resource):


    #@verifyToken
    def get(self, orchestrator, type, asset_id):
        if orchestrator != 'cloudformation' or type not in ['versa', 'generic']:
            return {"msg": "Not Supported"}, 400
        output = generateSpreadsheet(asset_id)
        if output == 1001:
            return {"msg": "Error retrieving template details"}, 500
        elif output == 1002:
            return {"msg": "Error processing template"}, 500
        elif output:
            return Response(output, mimetype="application/vnd.ms-excel",
                            headers={"Content-Disposition":
                                         "attachment;filename=config.xls"})
        return {"msg": "Spreadsheet generation failed"}, 500



