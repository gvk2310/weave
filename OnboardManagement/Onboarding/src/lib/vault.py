import json
import os
import requests
import traceback
from ..log import logger
from ..db.db import get
import base64

vault_url = os.environ['vaultUrl']
vault_token = os.environ['vaultToken']


def retrieveUrl(repo):
    try:
        resp = requests.get(
            f'{vault_url}/v1/secret/data/devnetops/Repo_Details/{repo}',
            headers={'X-Vault-Token': vault_token})
        if resp.status_code != 200:
            raise Exception(
                logger.error('Unable to get repo details'),
                logger.debug(traceback.format_exc()),
                logger.error(resp.json()))
        logger.info(f'Repo details retrieved for repo {repo}')
        response = resp.json()['data']['data']
        response['repo_password'] = str(
            base64.b64decode(response['repo_password']), "utf-8")
        return response
    except Exception as e:
        logger.error('Unable to get repo details')
        logger.debug(traceback.format_exc())
        logger.error(e)


def getRepoList():
    try:
        reposList = requests.get(
            f'{vault_url}/v1/secret/metadata/devnetops/Repo_Details?list=true',
            headers={'X-Vault-Token': vault_token})
        if reposList.status_code == 200:
            repos = reposList.json()['data']['keys']
            payload = []
            repo_assets = []
            for eachRepo in repos:
                repoInfo = requests.get(
                    f'{vault_url}/v1/secret/data/devnetops/Repo_Details/{eachRepo}',
                    headers={'X-Vault-Token': vault_token})
                repo_list = get()
                if repo_list:
                    assets_info = []
                    for asset in repo_list:
                        if  repoInfo.json()['data']['data']['repo_name'] == asset['asset_repository']:
                            assets_info.append({"asset_name": asset['asset_name'],"asset_vendor": asset['asset_vendor'],
                                            "asset_group": asset['asset_group'],
                                            "asset_type": asset['asset_type'], "asset_version": asset['asset_version']})
                        repo_assets = assets_info
                payload.append(
                        {"repo_name": repoInfo.json()['data']['data'][
                            'repo_name'],
                        "repo_vendor": repoInfo.json()['data']['data'][
                            'repo_vendor'],
                        "repo_url": repoInfo.json()['data']['data'][
                            'repo_url'],"assets_info": repo_assets})
            return payload
        elif reposList.status_code == 404:
            logger.info("No repositories onboarded")
            return False
        logger.debug(traceback.format_exc())
        logger.error(reposList.text)
    except Exception as e:
        logger.error('Unable to retrieve data from vault')
        logger.debug(traceback.format_exc())
        logger.error(e)


def getInfraList():
    try:
        infrasList = requests.get(
            f'{vault_url}/v1/secret/metadata/devnetops/Infra_Details?list=true',
            headers={'X-Vault-Token': vault_token})
        if infrasList.status_code == 200:
            infras = infrasList.json()['data']['keys']
            payload = []
            for eachInfra in infras:
                infraInfo = requests.get(
                    f'{vault_url}/v1/secret/data/devnetops/Infra_Details/{eachInfra}',
                    headers={'X-Vault-Token': vault_token})
                if infraInfo.json()['data']['data']['cloud_type'].lower() == 'aws':
                    payload.append(
                        {"infra_name": infraInfo.json()['data']['data'][
                            'infra_name'],
                        "cloud_type": infraInfo.json()['data']['data'][
                            'cloud_type'],
                        "environment": infraInfo.json()['data']['data'][
                            'environment'],
                        "orchestrator": infraInfo.json()['data']['data'][
                            'orchestrator']})
                elif infraInfo.json()['data']['data']['cloud_type'].lower() == 'openstack'and infraInfo.json()['data']['data']['orchestrator_password']:
                    payload.append(
                        {"infra_name": infraInfo.json()['data']['data'][
                            'infra_name'],
                        "cloud_type": infraInfo.json()['data']['data'][
                            'cloud_type'],
                        "environment": infraInfo.json()['data']['data'][
                            'environment'],
                        "orchestrator": infraInfo.json()['data']['data'][
                            'orchestrator'],
                        "RcFile" : infraInfo.json()['data']['data'][
                            'RcFile'],
                        "orchestrator_url" : infraInfo.json()['data']['data'][
                            'orchestrator_url']})
                else:
                    payload.append(
                        {"infra_name": infraInfo.json()['data']['data'][
                            'infra_name'],
                        "cloud_type": infraInfo.json()['data']['data'][
                            'cloud_type'],
                        "environment": infraInfo.json()['data']['data'][
                            'environment'],
                        "orchestrator": infraInfo.json()['data']['data'][
                            'orchestrator']})
                        
            return payload
        elif infrasList.status_code == 404:
            logger.info("No infra data onboarded")
            return False
        logger.debug(traceback.format_exc())
        logger.error(infrasList.text)
    except Exception as e:
        logger.error('Unable to retrieve data from vault')
        logger.debug(traceback.format_exc())
        logger.error(e)


def addDataToVault(args, repodata, apitype):
    try:
        if apitype.lower() == 'repo':
            secret_name = args['repo_name'].lower()
            folder_name = 'Repo_Details'
        elif apitype.lower() == 'infra':
            secret_name = args['infra_name'].lower()
            folder_name = 'Infra_Details'
        resp = requests.post(f"{vault_url}/v1/secret/data/devnetops/{folder_name}/{secret_name}",
                             headers={'X-Vault-Token': vault_token},
                             data=json.dumps(repodata))
        if resp.status_code != 200:
            raise Exception(
                logger.debug(traceback.format_exc()),
                logger.error(resp.text))
        logger.info('Data added successfully')
        return True
    except Exception as e:
        logger.error('Data could not be added to Vault')
        logger.debug(traceback.format_exc())
        logger.error(e)


def removeFromVault(args, apitype):
    try:
        if apitype.lower() == 'repo':
            secret_name = args['repo_name'].lower()
            folder_name = 'Repo_Details'
        elif apitype.lower() == 'infra':
            secret_name = args['infra_name'].lower()
            folder_name = 'Infra_Details'
        url = f"{vault_url}/v1/secret/metadata/devnetops/{folder_name}/{secret_name}"
        resp = requests.delete(url, headers={'X-Vault-Token': vault_token})
        if resp.status_code == 204:
            return True
        logger.debug(traceback.format_exc())
        logger.error(resp.text)
    except Exception as e:
        logger.error('Unable to delete data from vault')
        logger.debug(traceback.format_exc())
        logger.error(e)
