import boto3
import traceback
from ..log import logger
import requests
import json
import yaml


def aws_validate(access_key, secret_key):
    try:
        sts = boto3.client('sts', aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        print(sts.get_caller_identity())
        user_arn = sts.get_caller_identity()['Arn']
        if user_arn:
            return True
        else:
            raise Exception(
                logger.debug(traceback.format_exc()))
    except Exception as e:
        logger.error('AWS credentials are invalid')
        logger.debug(traceback.format_exc())
        logger.error(e)


def openstack_validate(rcfile):
    for line in rcfile.replace("export ","").split('\r\n'):
        if line.find('OS_USERNAME=') == 0:
            username = line.split('OS_USERNAME=')[1].replace('"', '')
        if line.find('OS_PASSWORD=') == 0:
            password = line.split('OS_PASSWORD=')[1].replace('"', '')
        if line.find('OS_PROJECT_DOMAIN_ID=') == 0:
            domain = line.split('OS_PROJECT_DOMAIN_ID=')[1].replace('"', '')
        if line.find('OS_AUTH_URL=') == 0:
            openstackurl = line.split('OS_AUTH_URL=')[1]
    dataStr = {"auth": {
        "identity": {
            "methods": [
                "password"
            ],
            "password": {
                "user": {
                    "name": username,
                    "domain": {
                        "name": domain
                    },
                    "password": password
                }}}}}
    try:
        resp = requests.post(f'{openstackurl}/auth/tokens',
                             data=json.dumps(dataStr), headers = {'Content-Type': 'application/json'})
        if resp.status_code == 201:
            return True
    except Exception as e:
        logger.error('Openstack credentials are invalid')
        logger.debug(traceback.format_exc())
        logger.error(e)
  

def osm_validate(osmurl, username, password):
    try:
        payload = {"username": username, "password": password}
        resp = requests.post(f"{osmurl}/osm/admin/v1/tokens",
                             data=json.dumps(payload), verify=False).text.encode('utf8')
        if 'id' in yaml.safe_load(resp):
            return True
    except Exception as e:
        logger.error('OSM credentials are invalid')
        logger.debug(traceback.format_exc())
        logger.error(e)
            
            
            
    # user = user_arn.split("user/",1)[1] 
    # iam = boto3.client('iam', aws_access_key_id=access_key, 
    # aws_secret_access_key= secret_key)
    # List_of_Policies = iam.list_attached_user_policies(UserName=user)
    # user_policies = []
    # for policy in List_of_Policies['AttachedPolicies']:
    #     user_policies.append(policy['PolicyName'])
    # required_policies = ['AmazonEC2FullAccess', 'AWSCloudFormationFullAccess']
    # print(user_policies)
    # if all(policy in user_policies for policy in required_policies):
    #     print('yes')
    # else:
    #     print('no')

