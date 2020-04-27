import traceback
from ..log import logger
from ..config.config import app
from flask_mongoengine import MongoEngine
from flask_security import Security, MongoEngineUserDatastore
from flask_security import UserMixin, RoleMixin
from flask_security.utils import hash_password, verify_password

db = MongoEngine(app)


class Services(db.Document):
    serviceName = db.StringField(max_lenth=255, unique=True)


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    read = db.ListField(db.ReferenceField(Services), default=[])
    write = db.ListField(db.ReferenceField(Services), default=[])


class User(db.Document, UserMixin):
    email = db.StringField(max_length=255, unique=True)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=False)
    roles = db.ListField(db.ReferenceField(Role), default=[])


user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)


def passChecker(passw):
    if not len(passw) > 7 or\
       not re.search('[A-Z]', passw) or \
       not re.search('[a-z]', passw) or \
       not re.search('[0-9]', passw) or \
       not re.search('[_@$]', passw):
        return False
    return True


def createUser(user, passw, roles):
    try:
        #if len(roles) != len(Role.objects(name__in=roles)):
         #   return False
        user_datastore.create_user(
            email=user,
            password=passw,
            roles=[roles]
        )
    except Exception as e:
        logger.debug(traceback.format_exc())
        logger.error(e)
        return None
    return True


def changePass(user, passw):
    try:
        usr = user_datastore.get_user(user)
        usr.update(password=hash_password(passw))
    except Exception as e:
        logger.error(e)
        return False
    return True


def modifyRoles(user, roles, action):
    try:
        if action == "remove_role":
            for role in roles:
                user_datastore.remove_role_from_user(user, role)
        if action == "add_role":
            for role in roles:
                user_datastore.add_role_from_user(user, role)
    except Exception as e:
        logger.error(e)
        return False
    return True


def deleteUser(user):
    try:
        usr = user_datastore.get_user(user)
        usr.delete()
    except Exception as e:
        logger.error(e)
        return False
    return True


def getServices():
    try:
        return [svc.serviceName for svc in Services.objects()]
    except Exception as e:
        logger.error(e)
        return False


def createSvc(name):
    try:
        svc = Services(serviceName=name)
        svc.save()
    except Exception as e:
        logger.error(e)
        return False
    return True

#not
def checkSvcUsage(svc):
    try:
        for ob in Role.objects():
            if svc in [obj.name for obj in (ob.read + ob.write)]:
                return True
        return False
    except Exception as e:
        logger.error(e)
        return None


def deleteSvcs(svc):
    if (check:=checkSvcUsage(svc)) == None:
        return False
    elif check == True:
        return 'Service still in use'
    try:
        Services.objects(name=svc).delete()
    except Exception as e:
        logger.error(e)
        return False


def getRoles():
    try:
        return [{"name": role.name,
                 "read": [item.name for item in role.read],
                 "write":[item.name for item in role.write]}
                for role in Role.objects()]
    except Exception as e:
        logger.error(e)


def createRole(role, read, write):
    if len(read)+len(write) > 0:
        dif = list(set(read+write)-set(getServices()))
    if len(dif) > 0:
        for svc in dif:
            if createSvc(svc) == False:
                return False
    rd = Services.objects(serviceName__in=read)
    wr = Services.objects(serviceName__in=write)
    try:
        user_datastore.create_role(name=role, read=rd, write=wr)
        logger.info(f'Role "{role}"" created')
        return True
    except Exception as e:
        logger.error(e)
        return False


def addSvcToRole(role, permType, svcs):
    if not createSvc(svcs): #need to define
            return False
    try:
        print('test')
        svcOb = Services.objects(serviceName=svcs)
        rol = Role.objects(name=role).first()
        print(rol)
        if permType == 'read':
            rol.read += svcOb
            rol.read = list(set(rol.read))
            rol.update(read=rol.read)
        if permType == 'write':
            rol.write += svcOb
            rol.write = list(set(rol.write))
            rol.update(read=rol.read)
        return True
    except Exception as e:
        logger.error(e)
        return False


def remSvcFrmRole(role, permType, svcs):
    print("removeService")
    try:
        print("hii")
        rol = Role.objects(name=role).first()
        newSvc = []
        if permType == 'read':
            newSvc = [item for item in rol.read if item.name not in svcs]
            rol.read = newSvc
            rol.delete(rol)
        if permType == 'write':
            newSvc = [item for item in rol.write if item.name not in svcs]
            rol.write = newSvc
            rol.delete(rol)
        return True
    except Exception as e:
        logger.error(e)
        return False

#not
def checkRoleUsage(role):
    try:
        usr = User.objects()
        return role in [r.name for u in usr for r in u.roles]
    except Exception as e:
        logger.error(e)
        return None


def deleteRole(role):
    if (check:=checkRoleUsage(role)) == None:
        return None
    elif check == True:
        return False
    try:
        rol = user_datastore.find_role(role)
        rol.delete()
        return True
    except Exception as e:
        logger.error(e)
        return None

#not
def userRoles(user):
    try:
        print(user)
        usr = user_datastore.get_user(user)
        print(usr)
        return [role.name for role in usr.roles]
    except Exception as e:
        logger.error(e)
        return False


def authenticateUser(user, passw):
    try:
        if not user_datastore.find_user(email=user):
            return False
        usr = user_datastore.get_user(user)
        return verify_password(passw, usr.password)
    except Exception as e:
        logger.error(e)
        return None
