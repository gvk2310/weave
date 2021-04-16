import traceback
import json
import os
import datetime
from ..log import logger
from ..config.config import app
from flask_mongoengine import MongoEngine
from bcrypt import hashpw, checkpw, gensalt
from kubernetes import config, client
import re

db = MongoEngine(app)


class Services(db.Document):
    name = db.StringField(required=True, unique=True)
    pod_state = db.StringField()
    service_state = db.StringField()
    endpoint_URL = db.StringField()


class serviceMap(db.EmbeddedDocument):
    type = db.StringField(choices=('read', 'write'))
    on = db.ListField(db.ReferenceField(Services), default=[])


class Role(db.Document):
    name = db.StringField(required=True, unique=True)
    access = db.EmbeddedDocumentField(serviceMap)


class User(db.Document):
    user_id = db.StringField(unique=True, required=True)
    email = db.EmailField(required=True, unique=True)
    name = db.StringField(required=True)
    project = db.StringField(required=True)
    roles = db.StringField(required=True)


def getUsers(**kwargs):
    try:
        if len(kwargs) > 0:
            usr = User.objects(__raw__=kwargs).first()
            return {"user_id": usr.user_id,
                    "name": usr.name,
                    "email": usr.email,
                    "project": usr.project,
                    "roles": usr.roles} if usr else False
        data = [{
            "user_id": usr.user_id,
            "name": usr.name,
            "email": usr.email,
            "project": usr.project,
            "roles": usr.roles}
            for usr in User.objects()
        ]
        return data if data else False
    except Exception as e:
        logger.error('Unable to retrieve user list')
        logger.debug(traceback.format_exc())
        logger.error(e)


def createUser(**kwargs):
    try:
        usr = User(user_id=kwargs['user_id'],
                   name=kwargs['name'],
                   email=kwargs['email'],
                   project=kwargs['project'],
                   roles=kwargs['roles'])
        usr.save()
        return True
    except Exception as e:
        logger.error(f"Failed to create user '{kwargs['name']}'")
        logger.debug(traceback.format_exc())
        logger.error(e)

def updateUserdetails(**kwargs):
    try:
        usr = User.objects(email=kwargs['email']).first()
        if 'project' in kwargs:
            usr.update(project=kwargs['project'])
        if 'roles' in kwargs:
            usr.update(roles=kwargs['roles'])
        logger.info(
            f"User '{kwargs['roles']}/{kwargs['project']}' has been updated")
        return True
    except Exception as e:
        logger.error(
            f"Unable to update role/project to the user '{kwargs['email']}'")
        logger.debug(traceback.format_exc())
        logger.error(e)



def deleteUser(user):
    try:
        usr = User.objects(email=user).first()
        usr.delete()
        logger.info(f"User '{user}' has been deleted")
        return True
    except Exception as e:
        logger.error(f"Unable to remove roles from the user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def getServices(svc=''):
    try:
        if svc:
            svcs = Services.objects(name=svc).first()
            return {"name": svcs.name,
                    "pod_state": svcs.pod_state,
                    "service_state": svcs.service_state,
                    "endpoint_URL": svcs.endpoint_URL
                    } if svcs else False
        data = [{"name": svc.name,
                 "pod_state": svc.pod_state,
                 "service_state": svc.service_state,
                 "endpoint_URL": svc.endpoint_URL
                 }
                for svc in Services.objects()]
        return data if data else False
    except Exception as e:
        logger.error("Unable retrieve service list")
        logger.debug(traceback.format_exc())
        logger.error(e)


def createSvc(name, pstatus, sstatus, endpoint):
    try:
        svc = Services(name=name, pod_state=pstatus, service_state=sstatus, endpoint_URL=endpoint)
        svc.save()
        addSvcToRole('admin', name)
        logger.info(f"Service '{name}' has been created")
        return True
    except Exception as e:
        logger.error(f"Failed to create service {name}")
        logger.debug(traceback.format_exc())
        logger.error(e)


def checkSvcUsage(svc):
    try:
        for ob in Role.objects(name__ne='admin'):
            if svc in [obj.name for obj in ob.access['on']]:
                return True
        return False
    except Exception as e:
        logger.error(f"Unable to check if service '{svc}' is in use")
        logger.debug(traceback.format_exc())
        logger.error(e)

        
def changePodStatus(name, status):
    try:
        svc = Services.objects(name=name).first()
        if not svc:
            return False
        svc.update(pod_state=status)
        logger.info(f"service state successfully changed for service '{svc}'")
        return True
    except Exception as e:
        logger.error(f"Unable to change service state '{svc}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def changeServiceStatus(name, status):
    try:
        svc = Services.objects(name=name).first()
        if not svc:
            return False
        svc.update(service_state=status)
        logger.info(f"service state successfully changed for service '{svc}'")
        return True
    except Exception as e:
        logger.error(f"Unable to change service state '{svc}'")
        logger.debug(traceback.format_exc())
        logger.error(e)
      
def changeServiceEndpoints(name, endpoints):
    try:
        end = Services.objects(name=name).first()
        if not end:
            return False
        end.update(endpoint_URL=endpoints)
        logger.info(f"service endpoint successfully changed for service '{end}'")
        return True
    except Exception as e:
        logger.error(f"Unable to change service endpoint '{end}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def getRoles(role=''):
    try:
        if role:
            obj = Role.objects(name=role).first()
            return {'role': obj.name,
                    'access': {'access_type': obj.access.type,
                               'access_on': [j.name for j in
                                             obj.access.on]}
                    } if obj else False
        data = [{'role': obj.name,
                 'access': {'access_type': obj.access.type,
                            'access_on': [item.name for item in
                                          obj.access.on]}
                 } for obj in Role.objects()]
        return data if data else False
    except Exception as e:
        logger.error(f"Unable to retrieve role list")
        logger.debug(traceback.format_exc())
        logger.error(e)


def createRole(role, svc, action):
    try:
        svc_objs = Services.objects(name__in=svc)
        if len(svc) != len(svc_objs):
            return False
        map_obj = serviceMap(type=action, on=svc_objs)
        rol = Role(name=role, access=map_obj)
        rol.save()
        return True
    except Exception as e:
        logger.error(f"Failed to create role '{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def addSvcToRole(role, svc):
    try:
        svcs = Services.objects(name__in=svc)
        if len(svc) != len(svcs):
            return 3
        obj = Role.objects(name=role).first()
        if all(x in obj.access.on for x in list(svcs)):
            return 1
        obj.access.on = list(set(obj.access.on + list(svcs)))
        obj.save()
        logger.info(f"svc added to '{role}'")
        return 2

    except Exception as e:
        logger.error(f"Unable to add new services to the role '{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)

def updateRoleSvcs(role, svc):
    try:
        role = Role.objects(name=role).first()
        svcs = Services.objects(name__in=svc)
        new_access= role.access
        new_access.on= svcs
        role.update(access=new_access)
        return True
    except Exception as e:
        logger.error(f"Unable to update services to the role '{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def checkAdminPrivilege(user):
    try:
        usr = User.objects(email=user).first()
        return 'admin' in [role.name for role in usr.roles]
    except Exception as e:
        logger.error(f"Failed to check admin privilege for user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def verifyPermissions(user, svc, perm):
    try:
        #allowing all users read permission to all pages
        if perm == 'read':
            return True
        roles = User.objects(email=user).first().roles
        for role in roles:
            if role.access.type == perm and svc in [item.name for item in
                                                    role.access.on]:
                return True
        return False
    except Exception as e:
        logger.error("Failed to verify permissions")
        logger.debug(traceback.format_exc())
        logger.error(e)
        

def deleteRole(role):
    roles = User.objects(roles=role).first()
    if roles is None:
        try:
            rol = Role.objects(name=role).first()
            rol.delete()
            logger.info(f"Role '{role}' deleted successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to delete role '{role}'")
            logger.debug(traceback.format_exc())
            logger.error(e)
    else:
        return False

def getUserSvcs(name=''):
    try:
        data = getUsers(name=name)
        resp = getRoles(role=data['roles'])
        return {'name': name.lower(),
                'role': data['roles'],
                'project':data['project'],
                'services': resp['access']['access_on']}
    except Exception as e:
        logger.error("unable to fetch user")
        logger.debug(traceback.format_exc())
        logger.error(e)


@app.before_first_request
def initial_data_setup():
        service_list = os.environ.get('service_list').split(',')
        for k in service_list:
            createSvc(k,'Disabled','Disabled','None')
        createRole('admin',service_list, 'write')
        username = os.environ.get('username')
        createUser(user_id=datetime.datetime.now().strftime("UR%Y%m%d%H%M%S"),
               name=username,
               email='ethanadmin@xyz.com',
               project='Devnetops',
               roles='admin')
