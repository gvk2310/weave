import requests
import traceback
from ..log import logger
from urllib3.exceptions import InsecureRequestWarning

def uploadToNexus(**kwargs):
    try:
        targetFilePath = f"{kwargs['repo']['repo_url']}" \
                         f"{kwargs['relTargetPath']}"
        requests.packages.urllib3.disable_warnings(
                                                category=InsecureRequestWarning)
        with open(kwargs['fileLoc'], 'rb') as rf:
            resp = requests.put(targetFilePath,
                                auth=(kwargs['repo']['repo_username'],
                                      kwargs['repo']['repo_password']),
                                data=rf.read(),verify=False)
            #To get content length
            targetFilePathTrim = targetFilePath[:-1]
            size = requests.get(targetFilePathTrim,
                                auth=(kwargs['repo']['repo_username'],
                                      kwargs['repo']['repo_password']),
                                      verify=False)
            size = size.headers['Content-Length']
        if resp.status_code != 201:
            raise Exception(
                logger.error(
                    f"Unable to upload {kwargs['filename']} to Nexus "
                    f"artifactory"),
                logger.debug(traceback.format_exc()))
        logger.info(
            f"File {kwargs['filename']} uploaded to Nexus artifactory")
        return targetFilePath, size
    except Exception as e:
        logger.error('Unable to push file to repo')
        logger.debug(traceback.format_exc())
        logger.error(e)


def deleteFromNexus(link, repo):
    try:
        requests.packages.urllib3.disable_warnings(
                                                category=InsecureRequestWarning)
        resp = requests.delete(link, auth=(
            repo['repo_username'], repo['repo_password']),verify=False)
        if resp.status_code != 204:
            raise Exception(
                logger.error(
                    f"Unable to delete {link.split('/')[-1]} from Nexus "
                    f"artifactory",
                    logger.debug(traceback.format_exc())))
        logger.info(
            f"File {link.split('/')[-1]} deleted from Nexus artifactory")
        return True
    except Exception as e:
        logger.error('Unable to delete file from repo')
        logger.debug(traceback.format_exc())
        logger.error(e)


def validateNexus(args):
    try:
        Nexus_url = args['repo_url']
        requests.packages.urllib3.disable_warnings(
                                                category=InsecureRequestWarning)
        repo_details = requests.get(Nexus_url,
                                    auth=(args['repo_username'],
                                          args['repo_password']),verify=False)
        if repo_details.status_code != 200:
            raise Exception(
                logger.debug(traceback.format_exc()),
                logger.error(repo_details.text))
        logger.info('Nexus Repo is validated')
        return repo_details
    except Exception as e:
        logger.error('invalid Nexus repository credentials')
        logger.debug(traceback.format_exc())
        logger.error(e)


def checkNexusUrl(arg, repo):
    try:
        checkUrl = arg['test_path']
        requests.packages.urllib3.disable_warnings(
                                                category=InsecureRequestWarning)
        resp = requests.get(checkUrl,
                            auth=(repo['repo_username'],
                                  repo['repo_password']),verify=False)
        if resp.status_code != 200:
            raise Exception(
                logger.error(
                    f"Test file path {arg['test_path']} could not be "
                    f"accessed"),
                logger.debug(traceback.format_exc()))
        logger.info(
            f"Test file path {arg['test_path']} is accessible")
        return True
    except Exception as e:
        logger.error(
            f"Test file path {arg['test_path']} could not be accessed")
        logger.debug(traceback.format_exc())
        logger.error(e)

def checkNexusRemote(arg, repo):
    try:
        checkUrl = arg['asset_path']
        requests.packages.urllib3.disable_warnings(
                                                category=InsecureRequestWarning)
        resp = requests.get(checkUrl,
                            auth=(repo['repo_username'],
                                  repo['repo_password']),verify=False)
        size = resp.headers['Content-Length']

        if resp.status_code != 200:
            raise Exception(
                logger.error(
                    f"Remote file path {arg['asset_path']} could not be "
                    f"accessed"),
                logger.debug(traceback.format_exc()))
        logger.info(
            f"Remote file path {arg['asset_path']} is accessible")
        return size
    except Exception as e:
        logger.error(
            f"Remote file path {arg['asset_path']} could not be accessed")
        logger.debug(traceback.format_exc())
        logger.error(e)
