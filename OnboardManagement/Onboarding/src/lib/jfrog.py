import os
import requests
import traceback
from ..log import logger

def validateJfrog(args):
    try:
        jfrog_url = args['repo_url'].split('/artifactory')[0]

        repo_details = requests.get(
            f"{jfrog_url}/artifactory/api/repositories",
            auth=(args['repo_username'], args['repo_password']))
        if repo_details.status_code != 200:
            raise Exception(
                logger.debug(traceback.format_exc()),
                logger.error(repo_details.text))
        logger.info('Jfrog Repo is validated')
        return repo_details
    except Exception as e:
        logger.error('invalid jfrog repository credentials')
        logger.debug(traceback.format_exc())
        logger.error(e)


def uploadToJfrog(arg, repo):
    try:
        targetFilePath = f"{repo['repo_url']}/{arg['asset_vendor']}/" \
                         f"{arg['asset_group']}/" \
                         f"{arg['asset_file_name']}-V{arg['asset_version']}"
        with open(arg['asset_file_loc'], 'rb') as rf:
           resp = requests.put(targetFilePath,
                            auth=(repo['repo_username'], repo['repo_password']),
                            data=rf.read())
        if resp.status_code != 201:
            raise Exception(
                logger.error(
                    f"Unable to upload {arg['asset_file'].filename} to Jfrog "
                    f"artifactory"),
                logger.debug(traceback.format_exc()),
                logger.error(resp.json()))
        logger.info(
            f"File {arg['asset_file'].filename} uploaded to Jfrog artifactory")
        return resp.json()['downloadUri'], resp.json()['size']
    except Exception as e:
        logger.error('Unable to push file to repo')
        logger.debug(traceback.format_exc())
        logger.error(e)


def checkJfrogRemote(arg, repo):
    try:
        checkUrl = arg['asset_path'].split('artifactory')
        checkUrl.insert(1, 'artifactory/api/storage')
        checkUrl = ''.join(checkUrl)

        resp = requests.get(checkUrl,
                            auth=(repo['repo_username'], repo['repo_password']))
        if resp.status_code != 200:
            raise Exception(
                logger.error(
                    f"Remote file path {arg['asset_path']} could not be "
                    f"accessed"),
                logger.debug(traceback.format_exc()),
                logger.error(resp.json()))
        logger.info(
            f"Remote file path {arg['asset_path']} is accessible")
        return resp.json()['size']
    except Exception as e:
        logger.error(
            f"Remote file path {arg['asset_path']} could not be accessed")
        logger.debug(traceback.format_exc())
        logger.error(e)


def deleteFromJfrog(link, repo):
    try:
        resp = requests.delete(link, auth=(
            repo['repo_username'], repo['repo_password']))
        if resp.status_code != 204:
            raise Exception(
                logger.error(
                    f"Unable to delete {link.split('/')[-1]} from Jfrog "
                    f"artifactory",
                    logger.debug(traceback.format_exc()),
                    logger.error(resp.json())))
        logger.info(
            f"File {link.split('/')[-1]} deleted from Jfrog artifactory")
        return True

    except Exception as e:
        logger.error('Unable to delete file from repo')
        logger.debug(traceback.format_exc())
        logger.error(e)
