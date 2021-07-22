import os
import time
import datetime
import pytz
import json
import boto3
from log import logger
from botocore.exceptions import ClientError


def delete_stack(stackname, region):
    try:
        client = boto3.client('cloudformation', region_name=region)
        client.delete_stack(StackName=stackname)
        logger.info(f"Deletion request sent for Stack: {stackname}")
        return True
    except ClientError as e:
        logger.error(e)


def check_delete_status(stackname, region, referenceTime):
    try:
        client = boto3.client('cloudformation', region_name=region)
        resp = client.list_stacks(
            StackStatusFilter=['DELETE_IN_PROGRESS', 'DELETE_FAILED',
                               'DELETE_COMPLETE'])['StackSummaries']
        stack_det = [item for item in resp if
                     item['StackName'] == stackname and item[
                         'DeletionTime'] > referenceTime]
        return stack_det[0]['StackStatus'] if stack_det else 0
    except ClientError as e:
        logger.error(e)
    except Exception as e:
        logger.error(e)


if __name__ == '__main__':
    config = json.loads(os.environ.get('config'))
    stacks = config['stacks']
    os.environ['AWS_ACCESS_KEY_ID'] = config['aws_access_key_id']
    os.environ['AWS_SECRET_ACCESS_KEY'] = config['aws_secret_access_key']
    failed_list = []
    que = []
    referenceTime = datetime.datetime.utcnow().replace(tzinfo=pytz.utc)
    for item in stacks:
        if not delete_stack(item['stack_name'], item['region']):
            failed_list.append(f"{item['stack_name']}({item['region']})")
        else:
            que.append((item['stack_name'], item['region']))
    logger.info('Checking the deletion status of the stacks')
    while len(que) > 0:
        recheck = []
        for item in que:
            status = check_delete_status(item[0], item[1], referenceTime)
            if status == 'DELETE_FAILED':
                failed_list.append((f"{item[0]}({item[1]})"))
                logger.info(f"Stack deletion failed for {item[0]}")
            elif status == 'DELETE_IN_PROGRESS':
                recheck.append((item[0], item[1]))
            elif status == 0:
                logger.info(
                    f"Stack :{item[0]} not found. Please check manually")
            else:
                logger.info(
                    f"Stack deletion successful for {item[0]}")
        que = recheck
        if que:
            time.sleep(15)
    if failed_list:
        with open('fail_msg', 'w') as f:
            f.write(
                f"Delete following stacks manually: "
                f"{','.join(failed_list)}")

        exit(-1)
