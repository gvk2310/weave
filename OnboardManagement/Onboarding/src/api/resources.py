import os
import base64
import datetime
from ..db import db
from ..log import logger
from flask import Response
from ..config.config import app
from ..lib.nexus import deleteFromNexus
from threading import Thread, ThreadError
from werkzeug.datastructures import FileStorage
from flask_restful import Resource, reqparse, inputs
from ..lib.sse import SSEGenerator, publish_onboard_events
from ..lib.jfrog import checkJfrogRemote, deleteFromJfrog, validateJfrog, checkJfrogUrl
from ..lib.cloud_validate import aws_validate, openstack_validate, osm_validate
from ..lib.vault import (getRepoList, getInfraList, removeFromVault,
                         addDataToVault)
from ..lib.commonfunctions import (localAssetOnboarding, localTestOnboarding,
                                   non_empty_string, retrieveUrl,
                                   validStrChecker, format_bytes, zipFileType,
                                   assetDeletefromRepo)


class Asset(Resource):


    #@verifyToken
    def get(self):
        data = db.get()
        if data:
            return data, 200
        elif data is False:
            return {'msg': 'No assets onboarded yet'}, 404
        return {'msg': 'Internal Server Error'}, 500

    #@verifyToken
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('asset_name', nullable=False, type=non_empty_string,
                            required=True)
        parser.add_argument('asset_vendor', nullable=False,
                            type=non_empty_string, required=True)
        parser.add_argument('asset_group', nullable=False,
                            type=non_empty_string, required=True)
        parser.add_argument('asset_type', nullable=False, type=non_empty_string,
                            required=True, choices=(
                'key files', 'template', 'nsd', 'vnfd', 'qcow'))
        parser.add_argument('asset_version', type=int, required=True)
        parser.add_argument('asset_repository', nullable=False,
                            type=non_empty_string, required=True)
        parser.add_argument('asset_path', type=non_empty_string)
        parser.add_argument('asset_file', type=FileStorage,
                                location='files')
        args = parser.parse_args()
        if not validStrChecker(args['asset_name']):
            return {
                       'message': 'Asset name cannot have special '
                                  'characters'}, 422
        if not validStrChecker(args['asset_group']):
            return {
                       'message': 'Asset group cannot have special '
                                  'characters'}, 422
        if not args['asset_path'] and not args['asset_file']:
            return {
                       'message': 'either asset file or asset path should be provided'}, 422
        repo_details = retrieveUrl(args['asset_repository'].lower())
        if not repo_details:
            return {"msg": "Unable to retrieve repo details"}, 500
        # Currently only supporting Jfrog repo
        if repo_details['repo_vendor'].lower() != 'jfrog':
            return {
                       "msg": "Only jfrog supported currently"}, 500
        check = db.get(name=args['asset_name'],
                    vendor=args['asset_vendor'],
                    group=args['asset_group'],
                    type=args['asset_type'],
                    version=args['asset_version'])
        if check:
            return {'msg': 'Asset with same version already exists, '
                           'either delete the version or create with a '
                           'different version'}, 403

        if args['asset_path']:
            if repo_details['repo_vendor'] == 'jfrog':
                size = checkJfrogRemote(args, repo_details)
            if not size:
                return {
                           "msg": "Remote file is not accessible"}, 500
            size = format_bytes(int(size))
            check = db.create(
                assetid=datetime.datetime.now().strftime("AS%Y%m%d%H%M%S"),
                name=args['asset_name'],
                vendor=args['asset_vendor'],
                group=args['asset_group'],
                type=args['asset_type'],
                size=size,
                version=args['asset_version'],
                repository=args['asset_repository'],
                link=args['asset_path'],
                scan_result='Unknown',
                onboard_status='Done'
            )
            if check:
                return {'msg': 'Onboarding successfully'}, 200
            else:
                return {'msg': 'Internal Server Error'}, 500
        elif args['asset_file']:
            args['assetid'] = datetime.datetime.now().strftime("AS%Y%m%d%H%M%S")
            args['asset_file_name'] = args['asset_file'].filename
            args['asset_file_loc'] = os.path.join(app.config['upload_folder'],
                                                  args['assetid'])
            args['asset_file'].save(args['asset_file_loc'])
            check = db.create(
                assetid=args['assetid'],
                name=args['asset_name'],
                vendor=args['asset_vendor'],
                group=args['asset_group'],
                type=args['asset_type'],
                version=args['asset_version'],
                repository=args['asset_repository'],
                size=None,
                link=None,
                scan_result='Scanning',
                onboard_status='In Progress'
            )
            if not check:
                return {'msg': 'Failed to initiate asset onboarding'}, 500
            try:
                Thread(target=localAssetOnboarding,
                       args=(args, repo_details)).start()
            except ThreadError as e:
                logger.error(e)
                db.update(assetid=args['assetid'],
                          scan_result='Unknown',
                          onboard_status='Failed')
                publish_onboard_events(assetid=args['assetid'],
                                     scan_result='Unknown',
                                     onboard_status='Failed')
                return {
                           'msg': 'Failed to initiate asset onboarding'}, 500
            return {'asset_id': args['assetid']}, 200     
          
    # @verifyToken
    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('asset_id', type=str, required=True)
        parser.add_argument('asset_group', type=str, required=True)
        parser.add_argument('asset_version', type=str, required=True)
        args = parser.parse_args()

        if not args['asset_version'] and not args['asset_group'] :
            return {"msg": "Nothing to modify"}, 400
        publish_onboard_events(assetid=args['asset_id'],
                             version=args['asset_version'],
                             group=args['asset_group'])
        done = db.update(assetid=args['asset_id'],
                         version=args['asset_version'],
                         group=args['asset_group'])
        if done:
            return {"msg": "asset_version and asset_group got updated"}, 200

        if done is False:
            return {"msg": "Asset ID does not exist"}, 400
        return {"msg": "asset_version and asset_group update failed"}, 500

    #@verifyToken
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('asset_id', nullable=False, type=non_empty_string,
                            required=True)
        parser.add_argument('delete_from_repo', type=inputs.boolean, default=False)
        args = parser.parse_args()
        resp = db.get(assetid=args['asset_id'])
        if not resp:
            return {"msg": "Unable to fetch asset details"}, 500
        if resp['onboard_status'] != 'Done':
            return {"msg": "Asset onboard not complete yet"}, 400
        repo_details = retrieveUrl(resp["asset_repository"].lower())
        if not repo_details:
            return {
                       "msg": "Unable to retrieve repo details"}, 500
        if args['delete_from_repo'] and repo_details[
            'repo_vendor'].lower() == 'jfrog':
            resp = deleteFromJfrog(resp['asset_link'], repo_details)
        if args['delete_from_repo'] and repo_details[
            'repo_vendor'].lower() == 'nexus':
            resp = deleteFromNexus(resp['asset_link'], repo_details)
            if not resp:
                return {"msg": "Unable to delete asset from repository"}, 500
        check = db.delete(assetid=args['asset_id'])
        if check:
            return {'msg': 'Asset Deleted'}, 200
        return {'msg': 'Internal Server Error'}, 500


class Repository(Resource):


    #@verifyToken
    def get(self):
        data = getRepoList()
        if data:
            return data, 200
        if data is False:
            return {'msg': 'No repositories onboarded yet'}, 404
        return {"msg": "Unable to retrieve repository list"}, 500

    #@verifyToken
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('repo_name', nullable=False, type=non_empty_string,
                            required=True)
        parser.add_argument('repo_vendor', nullable=False,
                            type=non_empty_string, required=True,
                            choices=('nexus', 'jfrog'))
        parser.add_argument('repo_url', type=inputs.url, required=True)
        parser.add_argument('repo_username', nullable=False,
                            type=non_empty_string, required=True)
        parser.add_argument('repo_password', nullable=False,
                            type=non_empty_string, required=True)
        parser.add_argument('action', nullable=False,
                            type=non_empty_string, required=True)                   
        args = parser.parse_args()
        action = args['action']
        parser.remove_argument('action')
        args = parser.parse_args()
        repolist = getRepoList()
        if action == 'create':
            if not validStrChecker(args['repo_name']):
                return {
                        'message': 'Repo name cannot have special '
                                    'characters'}, 422
            if repolist and (args['repo_name'] in [item['repo_name'] for item in repolist]):
                return {
                       "msg": f"Repository with the name '{args['repo_name']}' already onboarded"}, 400 
            if args['repo_vendor'].lower() not in ['jfrog']:
                return {'msg': 'Repository not supported'}, 400
            if repolist and (args['repo_url'] in [item['repo_url'] for item in
                                              repolist]) and (args['repo_name'] not in [item['repo_name'] for item in
                                          repolist]):
                return {
                        "msg": "Repository already exists, please create an "
                                "another one"}, 400
        if action == 'modify' and repolist:
            if args['repo_name'] not in [item['repo_name'] for item in repolist]:
                return {
                       "msg": f"Repo with the name '{args['repo_name']}' does not exist to update"}, 400
            for item in repolist:
                if (item['repo_url'] == args['repo_url']) and (item['repo_name'] != args['repo_name']):
                    return {
                            "msg": "Repository already exists, please create an another one"}, 400
        if args['repo_vendor'].lower() == 'jfrog':
            resp = validateJfrog(args)
        # elif args['repo_vendor'].lower() == 'nexus':
        #     resp = validateNexus(args)      
        if not resp:
            return {"msg": "Repository validation failed"}, 500
        if args['repo_url'] not in [item['url'] for item in resp.json()]:
            return {
                       "msg": "Either the repository does not exist or the "
                              "user doesnt have enough previliges to access "
                              "the repository"}, 400
        check = []
        if (repolist):
            for item in repolist:
                check.append(all(
                    item.get(key, None) == val for key, val in args.items()))
        if True in check and action == 'create':
            return {
                       "msg": "Repository with the same data is already "
                              "onboarded"}, 400
        args['repo_password'] = str(
            base64.b64encode(args['repo_password'].encode("utf-8")), "utf-8")
        repodata = {"data": args}
        resp = addDataToVault(args, repodata, 'Repo')
        if not resp:
            return {
                       "msg": f"Request not processed for repo {args['repo_name']}"}, 500
        else:
            if action == 'modify' and repolist:
                return {"msg": "Repository data updated successfully"}, 200
            else:
                return {"msg": "Repository onboarding successful"}, 200
              
              
              
    #@verifyToken
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('repo_name', type=str, required=True)
        parser.add_argument('delete_assets', type=str, required=True)
        args = parser.parse_args()
        data = getRepoList()
        if data is False:
            return {'msg': 'No repository information onboarded yet'}, 404
        if not data:
            return {
                       "msg": "Unable to retrieve repository list"}, 500
        if args['repo_name'] not in [item['repo_name'] for item in data]:
            return {'msg': 'Repository is not onboarded'}, 404
        if args['delete_assets'] == "True":
            asset_todelete_list = []
            asset_list = db.get()
            if asset_list:
                for asset in asset_list:
                    if args['repo_name'] == asset['asset_repository']:
                        asset_todelete_list.append(
                            {"asset_id": asset['asset_id'],
                             "asset_repository": asset['asset_repository'],
                             "asset_link": asset['asset_link']})
            status = []
            if (asset_todelete_list):
                for asset in asset_todelete_list:
                    resp_msg, resp_code = assetDeletefromRepo(asset)
                    if resp_code == 500:
                        status.append([asset['asset_id'], resp_msg])
            if status:
                return {"msg": "repo deletion failed",
                        "assets deletion failed for": status}, 500
        if removeFromVault(args, 'repo'):
            if args['delete_assets'] == "True":
                return {
                           'msg': 'Repository data deleted along with the '
                                  'corresponding assets'}, 200
            else:
                return {'msg': 'Repository data deleted'}, 200
        return {
                   'msg': 'Repository data could not be deleted'}, 500


class Infra(Resource):


    #@verifyToken
    def get(self):
        data = getInfraList()
        if data:
            return data, 200
        if data is False:
            return {
                       'msg': 'No infras onboarded yet'}, \
                   404
        return {
                   "msg": "Unable to retrieve infra list"}, 500

    #@verifyToken
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('infra_name', nullable=False, type=non_empty_string,
                            required=True)
        parser.add_argument('cloud_type', nullable=False, type=non_empty_string,
                            required=True, choices=('AWS', 'Openstack'))
        parser.add_argument('environment', nullable=False,
                            type=non_empty_string, required=True, choices=(
                'Demo', 'Test', 'Development', 'Stage', 'Production'))
        parser.add_argument('action', nullable=False,
                            type=non_empty_string, required=True)                   
        args = parser.parse_args()
        action = args['action']
        parser.remove_argument('action')
        args = parser.parse_args()
        infralist = getInfraList()
        if action == 'create':
            if not validStrChecker(args['infra_name']):
                return {
                        'message': 'Infra name cannot have special '
                                    'characters'}, 422
            if infralist and (
                    args['infra_name'] in [item['infra_name'] for item in
                                           infralist]):
                return {
                       "msg": f"Infra with the name '{args['infra_name']}' already onboarded"}, 400
        if action == 'modify':
            if infralist and (
                    args['infra_name'] not in [item['infra_name'] for item in
                                           infralist]):
                return {
                       "msg": f"Infra with the name '{args['infra_name']}' does not exist to update"}, 400
        if args['cloud_type'].lower() == 'aws':
            parser.add_argument('orchestrator', nullable=False,
                                type=non_empty_string, required=True,
                                choices=('Cloudformation'))
            parser.add_argument('access_key', nullable=False,
                                type=non_empty_string, required=True)
            parser.add_argument('secret_key', nullable=False,
                                type=non_empty_string, required=True)
            args = parser.parse_args()
            validate_cloud = aws_validate(args['access_key'],
                                          args['secret_key'])
        if args['cloud_type'].lower() == 'openstack':
            parser.add_argument('orchestrator', nullable=False,
                                type=non_empty_string,
                                choices=('OSM', 'Cloudify'))
            parser.add_argument('RcFile', nullable=False, type=non_empty_string,
                                required=True)
            parser.add_argument('orchestrator_url', nullable=False,
                                type=non_empty_string)
            parser.add_argument('orchestrator_username', nullable=False,
                                type=non_empty_string)
            parser.add_argument('orchestrator_password', nullable=False,
                                type=non_empty_string)
            args = parser.parse_args()
            validate_cloud = openstack_validate(args['RcFile'])
            if args['orchestrator'] and args['orchestrator'].lower() == 'osm':
                validate_osm = osm_validate(args['orchestrator_url'],
                                            args['orchestrator_username'],
                                            args['orchestrator_password'])
                if not validate_osm:
                    return {
                               "msg": "OSM validation failed, data could not "
                                      "be added"}, 500
        check = []
        if (infralist):
            for item in infralist:
                check.append(all(
                    item.get(key, None) == val for key, val in args.items()))
        if True in check and action == 'create':
            return {
                       "msg": "Infrastructure with the same data is already "
                              "onboarded"}, 400
        if validate_cloud:
            if 'access_key' and 'secret_key' in args:
                args['access_key'] = str(
                    base64.b64encode(args['access_key'].encode("utf-8")),
                    "utf-8")
                args['secret_key'] = str(
                    base64.b64encode(args['secret_key'].encode("utf-8")),
                    "utf-8")
            if 'orchestrator_password' in args:
                args['orchestrator_password'] = str(base64.b64encode(
                    args['orchestrator_password'].encode("utf-8")), "utf-8")
            repodata = {"data": args}
            resp = addDataToVault(args, repodata, 'infra')
            if not resp:
                return {
                           "msg": "Request not processed for infra "
                                  "{args['infra_name']"}, 500
            else:
                if action == 'modify':
                    return {"msg": "Infra data updated successfully"}, 200
                elif action == 'create':
                    return {"msg": "Infra onboarding successful"}, 200
        return {
                   "msg": "Cloud validation failed, data could not be added "}, 500
                  

    #@verifyToken
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('infra_name', type=str, required=True)
        args = parser.parse_args()
        data = getInfraList()
        if data is False:
            return {
                       'msg': 'No infrastructure information onboarded yet'}, \
                   404
        if not data:
            return {
                       "msg": "Unable to retrieve infra list"}, 500
        if args['infra_name'] not in [item['infra_name'] for item in data]:
            return {'msg': 'Infra is not onboarded'}, 404
        if removeFromVault(args, 'infra'):
            return {'msg': 'Infra data deleted'}, 200
        return {
                   'msg': 'Infra data could not be deleted'}, 500


class AssetDownloadDetails(Resource):


    #@verifyToken
    def get(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('assets', type=str, required=True, location='args')
        args = parser.parse_args()
        assets = args['assets'].split(',')
        output = []
        for asset in assets:
            asst_det = db.get(assetid=asset)
            repo_details = retrieveUrl(asst_det['asset_repository'].lower())
            output.append({"asset_link": asst_det['asset_link'],
                           "asset_type": asst_det['asset_type'],
                           "repo_username": repo_details['repo_username'],
                           "repo_password": repo_details['repo_password']})
        return output


class ServerEventMessage(Resource):


    # @verifyToken
    def get(self):
        stream = Response(SSEGenerator(), mimetype="text/event-stream",
                          headers={'Cache-Control': 'no-cache'})
        return stream
                  
                  
                  

class Tests(Resource):
              
    ##@verifyToken
    def get(self):
        data = db.getTest()
        if data:
             return data, 200
        elif data is False:
             return {'msg': 'No testcases onboarded yet'}, 404
        return {'msg': 'Internal Server Error'}, 500

    ##@verifyToken
    def post(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('test_name', nullable=False, type=non_empty_string,
                            required=True)
        parser.add_argument('test_description', nullable=False,
                            type=str, required=True)
        parser.add_argument('test_category', nullable=False,
                            type=non_empty_string, required=True)
        parser.add_argument('test_repository', nullable=False,
                            type=non_empty_string, required=True)
        parser.add_argument('test_scripttype', nullable=False,
                            type=non_empty_string, required=True,
                            choices=('python', 'ansible'))
        # parser.add_argument('test_parameters', type=dict, action='append', required=True)
        parser.add_argument('test_parameters', nullable=False,
                            type=non_empty_string,required=True)
        parser.add_argument('test_path', type=non_empty_string)
        parser.add_argument('test_file', type=zipFileType,
                            location='files')
        args = parser.parse_args()
        if args['test_scripttype'] == 'ansible':
            parser.add_argument('test_commands', type=non_empty_string,
                                required=True)
            args = parser.parse_args()
        if not validStrChecker(args['test_name']):
            return {
                       'message': 'Test name cannot have special '
                                  'characters'}, 422
        if not args['test_description']:
            return {
                       'message': 'Test description cannot have special '
                                  'characters'}, 422
        if not validStrChecker(args['test_category']):
            return {
                       'message': 'Test category cannot have special '
                                  'characters'}, 422
        check = db.getTest(name=args['test_name'])
        if check:
            return {'msg': 'Testcase with same name already exists'}, 403

        repo_details = retrieveUrl(args['test_repository'].lower())
        if not repo_details:
            return {"msg": "Unable to retrieve repo details"}, 500
        if args['test_path']:
            if args['test_path'].split('.')[-1] not in ['zip', 'gz']:
                return {"msg": "Provided path is not a  zip or gz"},400
            if checkJfrogUrl(args, repo_details) != True:
                return {"msg": "Invalid test path details"}, 500
            args['test_id'] = datetime.datetime.now().strftime("TC%Y%m%d%H%M%S")
            check = db.createTest(
                testcaseid=args['test_id'],
                name=args['test_name'],
                description=args['test_description'],
                category=args['test_category'],
                scripttype=args['test_scripttype'],
                commands=args[
                    'test_commands'] if 'test_commands' in args else 'None',
                parameters=args['test_parameters'],
                repository=args['test_repository'],
                link=args['test_path'],
                scan_result='Unknown',
                onboard_status='Done')
            if check:
                return {'test_id': args['test_id']}, 200
            else:
                return {'msg': 'Internal Server Error'}, 500
        elif args['test_file']:
            args['test_id'] = datetime.datetime.now().strftime("TC%Y%m%d%H%M%S")
            args['test_file_name'] = args['test_file'].filename
            args['test_file_loc'] = os.path.join(app.config['upload_folder'] \
                                                 , args['test_id'])
            args['test_file'].save(args['test_file_loc'])
            check = db.createTest(
                testcaseid=args['test_id'],
                name=args['test_name'],
                description=args['test_description'],
                category=args['test_category'],
                scripttype=args['test_scripttype'],
                commands=args[
                    'test_commands'] if 'test_commands' in args else 'None',
                parameters=args['test_parameters'],
                repository=args['test_repository'],
                link=None,
                scan_result='Scanning',
                onboard_status='In progress')
            if not check:
                return {'msg': 'Failed to initiate test onboarding'}, 500
            try:
                Thread(target=localTestOnboarding,
                       args=(args, repo_details)).start()
            except ThreadError as e:
                logger.error(e)
                publish_onboard_events(testcaseid=args['test_id'],
                                        scan_result='Unknown',
                                        onboard_status='Failed')
                db.updateTest(testcaseid=args['test_id'],
                                 scan_result='Unknown',
                                 onboard_status='Failed')
                return {
                           'msg': 'Failed to initiate test onboarding'}, 500
            return {'test_id': args['test_id']}, 200
              
              
    
    ##@verifyToken
    def put(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('test_id', type=str, required=True)
        parser.add_argument('test_description', type=str, required=True)
        parser.add_argument('test_category', type=str, required=True)
        args = parser.parse_args()

        if not args['test_description'] and not args['test_category']:
            return {"msg": "Nothing to modify"}, 400
        publish_onboard_events(testcaseid=args['test_id'],
                              description=args['test_description'],
                              category=args['test_category'])
        done = db.updateTest(testcaseid=args['test_id'],
                              description=args['test_description'],
                              category=args['test_category'])
        if done:
            return {"msg": "test_category and test_description got updated"} \
                , 200

        if done is False:
            return {"msg": "Test ID does not exist"}, 400
        return {"msg": "test_category and test_description update failed"}, 500


    ##@verifyToken
    def delete(self):
        parser = reqparse.RequestParser(trim=True, bundle_errors=True)
        parser.add_argument('test_id', nullable=False, type=non_empty_string,
                            required=True)
        parser.add_argument('delete_from_repo', type=inputs.boolean, default=False)
        args = parser.parse_args()
        resp = db.getTest(testcaseid=args['test_id'])
        if not resp:
            return {"msg": "Unable to fetch test details"}, 500
        if resp['onboard_status'] != 'Done':
            return {"msg": "Test onboard not completed or successful"}, 400
        repo_details = retrieveUrl(resp["test_repository"].lower())
        if not repo_details:
            return {
                       "msg": "Unable to retrieve repo details"}, 500
        if resp['test_link']:
            resp = deleteFromJfrog(resp['test_link'], repo_details)
            if not resp:
                return {"msg": "Unable to delete test from repository"}, 500
        check = db.deleteTest(testcaseid=args['test_id'])
        if check:
            return {'msg': 'Testcase Deleted'}, 200
        return {'msg': 'Internal Server Error'}, 500
              
              
              
              


