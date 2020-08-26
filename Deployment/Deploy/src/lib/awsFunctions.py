import io
import csv
import json
import base64
import datetime
from .commonFunctions import *
from ..log import logger
from ..config.config import app
from collections import defaultdict

vault_url = os.environ['vault_url']
vault_token = os.environ['vault_token']
jenkins_cft_deploy_job = os.environ['jenkins_cft_deploy_job']
jenkins_cft_delete_job = os.environ['jenkins_cft_delete_job']
status_url = os.environ['status_url']


def verifyParameters(file, templateInfo):
    try:
        template = requests.get(templateInfo['asset_link'], auth=(
            templateInfo['repo_username'],
            templateInfo['repo_password'])).json()
        parameters = template['Parameters'].keys()
        with open(file, 'r') as rf:
            r = csv.DictReader(rf)
            if not set(parameters) <= set(r.fieldnames) or sum(
                    1 for row in r for parm in parameters if
                    not row[parm].strip()) > 0:
                return False
        return True
    except Exception as e:
        logger.error("Parameters verification failed")
        logger.debug(traceback.format_exc())
        logger.error(e)


def getInfraDetails(infra):
    try:
        infraInfo = requests.get(
            f'{vault_url}/v1/secret/data/devnetops/Infra_Details/'
            f'{infra.lower()}',
            headers={'X-Vault-Token': vault_token})
        access_key = str(
            base64.b64decode(infraInfo.json()['data']['data']['access_key']),
            "utf-8")
        secret_key = str(
            base64.b64decode(infraInfo.json()['data']['data']['secret_key']),
            "utf-8")
        return access_key, secret_key
    except Exception:
        logger.error("Error retrieving Infra credentials")
        logger.debug(traceback.format_exc())


def createConfigJson(file, infra, templateInfo):
    try:
        csvfile = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(csvfile)
        if not verifyParameters(csvfile, templateInfo):
            logger.error("Config parameters verification failed")
            return 1001
        config = defaultdict(lambda: defaultdict(str))
        resp = getInfraDetails(infra)
        if not resp:
            return 1002
        config['defaults']['aws_access_key_id'] = resp[0]
        config['defaults']['aws_secret_access_key'] = resp[1]
        with open(csvfile, 'r') as rf:
            r = csv.DictReader(rf)
            for row in r:
                config['branch'][row.pop('Name')] = row
        os.remove(csvfile)
        config = {k: dict(v) for k, v in config.items()}
        return config
    except Exception as e:
        logger.error("Unable to retrieve deployments detail")
        logger.debug(traceback.format_exc())
        logger.error(e)


def triggerDeployment(depl_details, config, template):
    timestamp = datetime.datetime.utcnow()
    if depl_details['orchestrator'] == 'cloudformation':
        job_name = jenkins_cft_deploy_job
        parameters = {
            "deployment_id": timestamp.strftime("DP%Y%m%d%H%M%S"),
            "config": json.dumps(config),
            "assets": f"{template['asset_type']}, {template['asset_link']},"
                      f"{template['repo_username']},"
                      f"{template['repo_password']}",
            "status_url": status_url,
            "type": f"{depl_details['orchestrator']}_{depl_details['type']}"
        }
        if depl_details['type'] == 'versa':
            parameters.update({
                "director_ip": depl_details['director_ip'],
                "controller_ip": depl_details['controller_ip'],
            })
        return timestamp if triggerJenkins(parameters, job_name) else None


def deleteDeployment(depl_details):
    infra_details = getInfraDetails(depl_details['infra'])
    if not infra_details:
        return {'msg': 'Failed retrieving Infra details'}
    if depl_details['orchestrator'] == 'cloudformation':
        config = {"aws_access_key_id": infra_details[0],
                  "aws_secret_access_key": infra_details[1],
                  "stacks": [{
                      "stack_name": item,
                      "region":
                          depl_details['configurations']['config']['branch'][
                              item]['Region']}
                      for item in
                      depl_details['configurations']['config']['branch']
                  ]
                  }
        job_name = jenkins_cft_delete_job
        parameters = {
            "deployment_id": depl_details['id'],
            "status_url": status_url,
            "type": f"{depl_details['orchestrator']}_{depl_details['type']}"
        }
        if depl_details['type'] == 'generic':
            parameters.update({"config": json.dumps(config)})
        if depl_details['type'] == 'versa':
            parameters.update({
                "director_ip": depl_details['configurations']['director_ip'],
                "controller_ip": depl_details['configurations']['controller_ip']
            })
            parameters.update({"config": json.dumps(config)})
        return triggerJenkins(parameters, job_name)



def generateCSV(type, asset_id):
    try:
        if type == 'generic':
            templateInfo = assetDownloadDetails(asset_id)[0]
            if not templateInfo:
                return 1001
            resp = requests.get(templateInfo['asset_link'], auth=(
                templateInfo['repo_username'],
                templateInfo['repo_password']))
            if resp.status_code != 200:
                return 1002
            template = resp.json()
            conf_params = {item: template['Parameters'][item]['Default']
            if 'Default' in template['Parameters'][item]
            else '' for item in template['Parameters']}
            config = {"Name": "", "Region": ""}
            config.update(conf_params)
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(config.keys())
            writer.writerow(config.values())
        if type == 'versa':
            headers = ['Name', 'Ami', 'WsAmi', 'Region', 'KeyPairName',
                       'GatewayIp', 'VPCCIDR', 'DirectorManagementIP',
                       'DirectorSouthboundIP', 'ManagementIP', 'InternetIP',
                       'LanIP', 'WSLanIp', 'WSMgmtIp', 'ConToWS', 'SerialNum',
                       'SiteId']
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(headers)
        output.seek(0)
        return output
    except Exception as e:
        logger.error("CSV generation failed")
        logger.debug(traceback.format_exc())
        logger.error(e)
