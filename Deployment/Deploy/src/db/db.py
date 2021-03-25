import datetime
import traceback
from ..log import logger
from ..config.config import app
from flask_mongoengine import MongoEngine

db = MongoEngine(app)


class deployments(db.Document):
    id = db.StringField(primary_key=True)
    name = db.StringField(required=True, unique=True)
    orchestrator = db.StringField(required=True)
    type = db.StringField(required=True)
    infra = db.StringField(required=True)
    environment = db.StringField(required=True)
    configurations = db.DictField(required=True)
    assets = db.DictField(required=True)
    status = db.StringField(required=True)
    logs = db.StringField(required=True)
    created = db.DateTimeField(required=True)
    stage_info = db.DictField(default={})
    instances = db.ListField(db.DictField(required=True), default=[])





def get(**kwargs):
    try:
        if len(kwargs) > 0:
            depl = deployments.objects(id=kwargs['id']).first()
            return {'id': depl.id,
                    'name': depl.name,
                    'orchestrator': depl.orchestrator,
                    'type': depl.type,
                    'infra': depl.infra,
                    'environment': depl.environment,
                    'configurations': depl.configurations,
                    'assets': ','.join(depl.assets),
                    'status': depl.status,
                    'logs': depl.logs,
                    'created (utc)': depl.created.strftime(
                        "%d-%m-%Y %H:%M:%S"),
                    'stage_info': depl.stage_info,
                    'instances': depl.instances} if depl else False
        depls = deployments.objects()
        return [{'id': deployment.id,
                 'name': deployment.name,
                 'orchestrator': deployment.orchestrator,
                 'type': deployment.type,
                 'infra': deployment.infra,
                 'environment': deployment.environment,
                 'configurations': deployment.configurations,
                 'assets': ','.join(deployment.assets),
                 'status': deployment.status,
                 'logs': deployment.logs,
                 'created (utc)': deployment.created.strftime(
                     "%d-%m-%Y %H:%M:%S"),
                 'stage_info': deployment.stage_info,
                 'instances': deployment.instances} for deployment in
                depls] if depls else False
    except Exception as e:
        logger.error("Unable to get deployments detail")
        logger.debug(traceback.format_exc())
        logger.error(e)


def check_deployment(**kwargs):
    try:
        if deployments.objects(__raw__={k: v for k, v in kwargs.items() if
                                        k != 'name'}).first():
            return 1001
        if deployments.objects(name=kwargs['name']).first():
            return 1002
        return True
    except Exception as e:
        logger.error("Unable to save deployments detail")
        logger.debug(traceback.format_exc())
        logger.error(e)


def create(**kwargs):
    try:
        timestamp = datetime.datetime.utcnow().strftime("%d-%m-%Y %H:%M:%S")
        depl = deployments(id=kwargs['id'],
                           name=kwargs['name'],
                           environment=kwargs['environment'],
                           orchestrator=kwargs['orchestrator'],
                           type=kwargs['type'],
                           infra=kwargs['infra'],
                           configurations=kwargs['configurations'],
                           assets=kwargs['assets'],
                           status='DEPLOY_IN_PROGRESS',
                           logs=f"{timestamp} | Deployment initiated",
                           created=kwargs['timestamp'])
        depl.save()
        return True
    except Exception as e:
        logger.error("Unable to save deployments detail")
        logger.debug(traceback.format_exc())
        logger.error(e)


def update(**kwargs):
    try:
        obj = deployments.objects(id=kwargs['id']).first()
        if not obj:
            return False
        timestamp = datetime.datetime.utcnow().strftime("%d-%m-%Y %H:%M:%S")
        logs = f"{timestamp} | {kwargs['message']}\n" + obj.logs
        logs = logs.replace(" | Deployment initiated","")
        obj.update(status=kwargs['status'],
                   logs=logs)
        if kwargs['stage_info']:
            for stage_name, stage_status in kwargs['stage_info'].items():
                if stage_name not in obj.stage_info:
                    obj.stage_info[stage_name]={}
                obj.stage_info[stage_name]['status'] = stage_status
            obj.save()
        #if kwargs['stage_info']:
        #    stage_name = kwargs['stage_info'].split('-')[0]
        #   stage_status = kwargs['stage_info'].split('-')[1]
            # stage_msg = kwargs['stage_info'].split['-'][2] \
            #     if kwargs['stage_info'].count('-') > 1 else ''
        #    obj.stage_info[stage_name]['status'] = stage_status
            # obj.stage_info[stage_name]['info'] = stage_msg
        #    for stg_name in stages[obj.type][
        #                    :stages[obj.type].index(stage_name)]:
        #        if not obj.stage_info[stg_name]['status']:
        #            obj.stage_info[stg_name]['status'] = 'skipped'
                    # obj.stage_info[stg_name]['info'] = 'No data found'
        #    obj.save()
        if kwargs['instances']:
            obj.update(instances=kwargs['instances'])
        return True
    except Exception as e:
        logger.error("Unable to save deployments detail")
        logger.debug(traceback.format_exc())
        logger.error(e)


def delete(**kwargs):
    try:
        obj = deployments.objects(id=kwargs['id']).first()
        if not obj:
            return False
        obj.delete()
        return True
    except Exception as e:
        logger.error("Unable to delete deployments detail")
        logger.debug(traceback.format_exc())
        logger.error(e)
