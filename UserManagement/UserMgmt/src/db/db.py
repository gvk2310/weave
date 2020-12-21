import traceback
from ..log import logger
from ..config.config import app
from flask_mongoengine import MongoEngine
from bcrypt import hashpw, checkpw, gensalt

db = MongoEngine(app)


class Services(db.Document):
    name = db.StringField(required=True, unique=True)
    state = db.StringField(choices=('enabled', 'disabled'))
    endpoint = db.StringField()


class serviceMap(db.EmbeddedDocument):
    type = db.StringField(choices=('read', 'write'))
    on = db.ListField(db.ReferenceField(Services), default=[])


class Role(db.Document):
    name = db.StringField(required=True, unique=True)
    access = db.EmbeddedDocumentField(serviceMap)


class User(db.Document):
    email = db.EmailField(required=True, unique=True)
    name = db.StringField(required=True)
    password = db.StringField(required=True)
    roles = db.ListField(db.ReferenceField(Role), default=[])


def getUsers(email=''):
    try:
        if email:
            usr = User.objects(email=email).first()
            return {"email": usr.email,
                    "name": usr.name,
                    "roles": [role.name for role in
                              usr.roles]} if usr else False
        data = [{
            "email": usr.email,
            "name": usr.name,
            "roles": [role.name for role in usr.roles]}
            for usr in User.objects()
        ]
        return data if data else False
    except Exception as e:
        logger.error('Unable to retrieve user list')
        logger.debug(traceback.format_exc())
        logger.error(e)


def createUser(email, name, passw, roles):
    try:
        #global read permission for all users
        # roles.append('GlobalReader')
        rols = Role.objects(name__in=roles)
        if len(roles) != len(rols):
            return False
        usr = User(email=email, password=hashpw(
            passw.encode('utf-8'), gensalt()), roles=rols, name=name)
        usr.save()
        return True
    except Exception as e:
        logger.error(f"Failed to create user '{name}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def changePass(user, passw):
    try:
        usr = User.objects(email=user).first()
        usr.update(
            password=hashpw(passw.encode('utf-8'), gensalt()).decode('utf-8'))
        logger.info(f"Password successfully changed for user '{user}'")
        return True
    except Exception as e:
        logger.error(f"Failed to change password for user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def changeuserName(user, name):
    try:
        uname = User.objects(email=user).first()
        uname.update(name=name)
        logger.info(f"username successfully changed for user '{user}'")
        return True
    except Exception as e:
        logger.error(f"Failed to change username for user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def addRoleToUser(user, roles):
    try:
        rols = Role.objects(name__in=roles)
        if len(roles) != len(rols):
            return False
        usr = User.objects(email=user).first()
        if all(x in usr.roles for x in list(rols)):
            return 1
        new_roles = usr.roles + list(rols)
        usr.update(roles=list(set(new_roles)))
        logger.info(f"New roles - {','.join(roles)} added to the user '{user}'")
        return True
    except Exception as e:
        logger.error(f"Unable to add new roles to the user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def removeRoleFrmUser(user, roles):
    try:
        usr = User.objects(email=user).first()
        new_roles = list(set(usr.roles) - set(Role.objects(name__in=roles)))
        if set(usr.roles) == set(new_roles):
            logger.error(f"User '{user}' doesn't have any of these roles")
            return 1
        if len(usr.roles) == 1 or len(usr.roles) == len(roles):
            logger.error(f" Removing this role will remove all the roles for the User '{user}'. You can delete the User instead if not being used.")
            return 2
        usr.update(roles=new_roles)
        logger.info(
            f"Roles - '{','.join(roles)}' has been removed from the user '"
            f"{user}'")
        return 3
    except Exception as e:
        logger.error(f"Unable to remove roles from the user '{user}'")
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
            obj = Services.objects(name=svc).first()
            return {"name": obj.name,
                    "state": obj.state,
                    "endpoint": obj.endpoint
                    } if obj else False
        data = [{"name": svc.name,
                 "state": svc.state,
                 "endpoint": svc.endpoint
                 }
                for svc in Services.objects()]
        return data if data else False
    except Exception as e:
        logger.error("Unable retrieve service list")
        logger.debug(traceback.format_exc())
        logger.error(e)


def createSvc(name, status, endpoint):
    try:
        svc = Services(name=name, state=status, endpoint=endpoint)
        svc.save()
        # addSvcToRole('GlobalReader', name)
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


def deleteSvcs(svc):
    check = checkSvcUsage(svc)
    if check is None:
        return None
    elif check:
        return False
    try:
        if not Services.objects(name=svc).first():
            return False
        # remSvcFrmRole('Global Reader', svc)
        remSvcFrmRole('admin', svc)
        Services.objects(name=svc).delete()
        return True
    except Exception as e:
        logger.error(f"Unable to delete service '{svc}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def changeServiceStatus(svc, status):
    try:
        svc = Services.objects(name=svc).first()
        if not svc:
            return False
        svc.update(state=status)
        logger.info(f"service state successfully changed for service '{svc}'")
        return True
    except Exception as e:
        logger.error(f"Unable to change service state '{svc}'")
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
            return False
        obj = Role.objects(name=role).first()
        obj.access.on = list(set(obj.access.on + list(svcs)))
        obj.save()
        return True
    except Exception as e:
        logger.error(f"Failed to add services to role '{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)
        
        
def remSvcFrmRole(role, svcs):
    try:
        svc = Services.objects(name__in=svcs)
        if len(svc) != len(svcs):
            return 3
        obj = Role.objects(name=role).first()
        if len(obj.access.on) == 1 or len(obj.access.on) == len(svcs):
            return 1
        obj.access.on = [item for item in obj.access.on if
                         item.name not in svcs]
        obj.save()
        return 2
    except Exception as e:
        logger.error(f"Failed to remove services from role'{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)




def checkRoleUsage(role):
    try:
        usr = User.objects()
        return role in [r.name for u in usr for r in u.roles]
    except Exception as e:
        logger.error(f"Failed to check role usage for '{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def deleteRole(role):
    check = checkRoleUsage(role)
    if check is None:
        return None
    elif check:
        return False
    try:
        rol = Role.objects(name=role).first()
        rol.delete()
        logger.info(f"Role '{role}' deleted successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to delete role '{role}'")
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


def authenticateUser(email, passw):
    try:
        usr = User.objects(email=email).first()
        if not usr:
            return False
        return checkpw(passw.encode('utf8'), usr.password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Failed to verify user '{email}'")
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


# its like a root user, once logged, it is suggested that the admin changes
# password
@app.before_first_request
def initial_data_setup():
    users = getUsers()
    if not users:
        svcs = {'onboard':'http://onboardmgmt.devnetops.svc.cluster.local:8080',
                'deploy':'http://deployment.devnetops.svc.cluster.local:8080',
                'security':'http://security.devnetops.svc.cluster.local:8080',
                'monitor':'http://monitor.devnetops.svc.cluster.local:8080'}
        for k,v in svcs.items():
            createSvc(k,'disabled',v)
        createRole('admin', svcs.keys(), 'write')
        createUser('admin@dnops.com', 'Admin', 'Admin@123',
                   ['admin'])
