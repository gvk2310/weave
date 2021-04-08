from logger import logger
import boto3
from botocore.exceptions import ClientError
from urllib.parse import unquote
import json
import datetime
import pytz
import os
import time
import re
from deleteStack import delete_stack, check_delete_status


def create_stack(region, stackname, template):
    global msg
    try:
        client = boto3.client('cloudformation', region_name=region)
        response = client.create_stack(
            StackName=stackname, TemplateBody=template, Parameters=params,
            OnFailure='DO_NOTHING')
        logger.info(f"Create in progress for Stack Id {response['StackId']}")
        return response['StackId']
    except ClientError as e:
        msg = msg + str(e) + '. '
        logger.error(e)


def create_params(template, config, br):
    try:
        return [{'ParameterKey': parameter,
                 'ParameterValue': config['branch'][br][parameter]} for
                parameter in
                template['Parameters']]
    except Exception as e:
        logger.error(f'Failed to generate parameters for branch {br}')
        logger.error(e)


def update_eip(logs, stack_id):
    global Instance_details
    instance_id = set()
    for log in logs:
        if (log['ResourceType'] == 'AWS::EC2::Instance') and log['PhysicalResourceId'] != '':
            instance_id.add(log['PhysicalResourceId'])
    if len(instance_id) < 1:
        logger.info(f'Instance id not found for {stack_id}')
        return False
    try:
        client = boto3.client('ec2', region_name=stack_id.split(':')[3])
        r = client.describe_instances(InstanceIds=list(instance_id))
    except ClientError as e:
        logger.error(e)
    for item in r['Reservations']:
        Instance_details.append({"name": f"{stack_id.split('/')[1]}",
                                     "public_ip": item['Instances'][0]['PublicIpAddress']})
        logger.info(
                f"{stack_id.split('/')[1]} ip: {item['Instances'][0]['PublicIpAddress']}")
    return True


def failed_status(stack_id, logs):
    global msg
    for log in logs:
        if log['ResourceStatus'] == 'CREATE_FAILED' and \
                'ResourceStatusReason' in log.keys():
            msg = msg + f"Failed to create {stack_id.split('/')[1]} " \
                               f"with reason - {log['ResourceStatusReason']}. "
            logger.info(
                f"Stack({stack_id.split('/')[1]}) creation failed with reason -"
                f" {log['ResourceStatusReason']}")


def check_branch_status(stack_id):
    sucessStates = ["CREATE_COMPLETE", "UPDATE_COMPLETE"]
    failureStates = ["CREATE_FAILED", "DELETE_FAILED", "ROLLBACK_COMPLETE",
                     "ROLLBACK_FAILED", "UPDATE_ROLLBACK_COMPLETE",
                     "UPDATE_ROLLBACK_FAILED", "DELETE_COMPLETE"]
    try:
        client = boto3.client(
            'cloudformation', region_name=stack_id.split(':')[3])
        response = client.describe_stack_events(StackName=stack_id)
    except ClientError as e:
        logger.error(e)
    if response['StackEvents'][0]['LogicalResourceId'] == stack_id.split('/')[
        1] and response['StackEvents'][0]['ResourceStatus'] in sucessStates:
        if update_eip(response['StackEvents'], stack_id):
            logger.info(f"StackId {stack_id} has been created")
            return 2
        else:
            return 0
    elif response['StackEvents'][0]['LogicalResourceId'] == stack_id.split('/')[
        1] and response['StackEvents'][0]['ResourceStatus'] in failureStates:
        failed_status(stack_id, response['StackEvents'])
        return 1
    else:
        return 0


def delete_stacks(stackList, referenceTime):
    global msg
    failed_list = []
    que = []
    logger.info(
        'Initiating deletion of other stacks as one of the stack '
        'creation failed.')
    for item in stackList:
        if not delete_stack(item[0], item[1]):
            failed_list.append(f"{item[0]}({item[1]})")
        else:
            que.append((item[0], item[1]))
    logger.info('Checking the deletion status of the stacks')
    while len(que) > 0:
        recheck = []
        time.sleep(15)
        for item in que:
            status = check_delete_status(item[0], item[1], referenceTime)
            if status == 'DELETE_FAILED':
                failed_list.append((f"{item[0]}({item[1]})"))
                logger.info(f"Stack deletion failed for {item[0]}")
            elif status == 'DELETE_IN_PROGRESS':
                recheck.append((item[0], item[1]))
            else:
                logger.info(
                    f"Stack deletion successful for {item[0]}")
        que = recheck
    if failed_list:
        msg = msg + f"Delete following stacks manually: " \
                           f"{','.join(failed_list)}."


if __name__ == '__main__':
    msg = ''
    #director_ip = os.environ['director_ip']
    #controller_ip = os.environ['controller_ip']
    assets = os.environ['assets']

    Instance_details = []
    for item in assets.split(';'):
        if item.split(',')[0] == 'template':
            template = unquote(item.split(',')[1]).split('/')[-1]
            break
    try:
        with open(template, 'r') as file:
            template = json.load(file)
    except:
        logger.error('Template file not found or Error opening template file')
        exit(-1)

    config = json.loads(os.environ.get('config'))
    if not config:
        logger.error('Error retrieving config file')
        exit(-1)

    os.environ['AWS_ACCESS_KEY_ID'] = config['defaults']['aws_access_key_id']
    os.environ['AWS_SECRET_ACCESS_KEY'] = config['defaults'][
        'aws_secret_access_key']
    StackIds = []
    referenceTime = datetime.datetime.utcnow().replace(tzinfo=pytz.utc)
    for br in config['branch']:
        params = create_params(template, config, br)
        if not params:
            logger.error(f'Skipping stack creation for branch {br}')
        stack_id = create_stack(config['branch'][br]['Region'], br,
                                json.dumps(template, indent=4), params)
        if stack_id:
            StackIds.append(stack_id)
        else:
            logger.error(f'Failed to create stack {br}')
            break
    if len(StackIds) < len(config['branch']):
        logger.info("Aboring deployment")
        stackList = [(stack_id.split('/')[1], stack_id.split(':')[3]) for
                     stack_id in StackIds]
        if stackList:
            delete_stacks(stackList, referenceTime)
        with open('fail_msg', 'w') as f:
            f.write(msg)
        exit(-1)
    branches = []
    time.sleep(110)
    while len(StackIds) > 0:
        time.sleep(3)
        temp = []
        for stack_id in StackIds:
            resp = check_branch_status(stack_id)
            if resp < 1:
                temp.append(stack_id)
            elif resp > 1:
                branches.append(stack_id.split('/')[1])
            else:
                break
        StackIds = temp
    if len(branches) < len(config['branch']):
        logger.info("Aboring deployment")
        stackList = [(stack_id.split('/')[1], stack_id.split(':')[3])
                     for stack_id in set(branches + StackIds)]
        if stackList:
            delete_stacks(stackList, referenceTime)
        with open('fail_msg', 'w') as f:
            f.write(msg)
        exit(-1)
    with open('instanceDetails', 'w') as f:
        f.write(json.dumps(Instance_details))
