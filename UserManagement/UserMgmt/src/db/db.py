import traceback
from ..log import logger
from ..config.config import app
from flask_mongoengine import MongoEngine
from bcrypt import hashpw, checkpw, gensalt

db = MongoEngine(app)


class Services(db.Document):
    name = db.StringField(required=True, unique=True)
    state = db.BooleanField(required=True, default=False)


class Role(db.Document):
    name = db.StringField(required=True, unique=True)
    read = db.ListField(db.ReferenceField(Services), default=[])
    write = db.ListField(db.ReferenceField(Services), default=[])


class User(db.Document):
    email = db.EmailField(required=True, unique=True)
    name = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)
    roles = db.ListField(db.ReferenceField(Role), default=[])


def logs(msg, traceback, exception):
    logger.error(msg)
    logger.debug(traceback)
    logger.error(exception)


def getUsers():
    try:
        return [{
            "email": usr.email,
            "roles": [role.name for role in usr.roles]}
            for usr in User.objects()
        ]
    except Exception as e:
        logs('Unable to retrieve user list',traceback.format_exc(), e)


def createUser(name, user, passw, roles):
    try:
        rols = Role.objects(name__in=roles)
        if len(roles) != len(rols):
            return False
        # roles = Role.objects(name__in=roles)
        usr = User(email=user, password=hashpw(
            passw.encode('utf-8'), gensalt()), roles=rols,name=name)
        usr.save()
        logger.info(f"User '{user}' created with roles '{','.join(roles)}'")
        return True
    except Exception as e:
        logs(f"Failed to create user '{user}'",traceback.format_exc(), e)


def changePass(user, passw):
    try:
        usr = User.objects(email=user).first()
        usr.update(password=hashpw(passw.encode('utf-8'), gensalt()).decode('utf-8'))
        logger.info(f"Password successfully changed for user '{user}'")
        return True
    except Exception as e:
        logs(f"Failed to change password for user '{user}'",traceback.format_exc(), e)

                  
def changeuserName(user, name):
    try:
        uname = User.objects(email=user).first()
        uname.update(name=name)
        logger.info(f"username successfully changed for user '{user}'")
        return True
    except Exception as e:
        logs(f"Failed to change username for user '{user}'",traceback.format_exc(), e)


def addRoleToUser(user, roles):
    try:
        rols = Role.objects(name__in=roles)
        if len(roles) != len(rols):
            return False
        usr = User.objects(email=user).first()
        new_roles = usr.roles + list(rols)
        usr.update(roles=new_roles)
        logger.info(
            f"New roles - {','.join(roles)} added to the user '{user}'")
        return True
    except Exception as e:
        logs(f"Unable to add new roles to the user '{user}'",traceback.format_exc(), e)


def removeRoleFrmUser(user, roles):
    try:
        usr = User.objects(email=user).first()
        new_roles = list(set(usr.roles) - set(Role.objects(name__in=roles)))
        usr.update(roles=new_roles)
        logger.info(
            f"Roles - '{','.join(roles)}' has been removed from the user '{user}'")
        return True
    except Exception as e:
        logs(f"Unable to remove roles from the user '{user}'",traceback.format_exc(), e)


def deleteUser(user):
    try:
        usr = User.objects(email=user).first()
        usr.delete()
        logger.info(f"User '{user}' has been deleted")
        return True
    except Exception as e:
        logs(f"Unable to remove roles from the user '{user}'",traceback.format_exc(), e)


def getServices():
    try:
        return [svc.name for svc in Services.objects()]
    except Exception as e:
        logs("Unable retrieve service list",traceback.format_exc(), e)


def createSvc(name):
    try:
        svc = Services(name=name)
        svc.save()
        addSvcToRole('admin', read=[name], write=[name])
        logger.info(f"Service '{name}' has been created")
        return True
    except Exception as e:
        logs(f"Failed to create service {name}",traceback.format_exc(), e)


def checkSvcUsage(svc):
    try:
        for ob in Role.objects(name__ne='admin'):
            if svc in [obj.name for obj in (ob.read + ob.write)]:
                return True
        return False
    except Exception as e:
        logs(f"Unable to check if service '{svc}' is in use",traceback.format_exc(), e)


def deleteSvcs(svc):
    check = checkSvcUsage(svc)
    if check == None:
        return None
    elif check == True:
        return False
    try:
        remSvcFrmRole('admin', read=[svc], write=[svc])
        Services.objects(name=svc).delete()
        return True
    except Exception as e:
        logs(f"Unable to delete service '{svc}'",traceback.format_exc(), e)


def getRoles():
    try:
        msg = [{"name": role.name,
                "read": [item.name for item in role.read],
                "write":[item.name for item in role.write]}
               for role in Role.objects()]
        return msg
    except Exception as e:
        logs(f"Unable to retrieve role list",traceback.format_exc(), e)


def createRole(role, read=[], write=[]):
    if len(set(read+write)) != len(Services.objects(name__in=list(set(read+write)))) and len(read+write)>0:
        return False
    try:
        rol = Role(name=role, read=Services.objects(name__in=read),
                   write=Services.objects(name__in=write))
        rol.save()
        logger.info(f"Role '{role}' has been created")
        return True
    except Exception as e:
        logs(f"Failed to create role '{role}'",traceback.format_exc(), e)


def addSvcToRole(role, read=[], write=[]):
    if len(set(read+write)) != len(Services.objects(name__in=list(set(read+write)))):
        return False
    try:
        rol = Role.objects(name=role).first()
        if len(read) > 0:
            rol.update(read=list(set(rol.read + list(Services.objects(name__in=read)))))
        if len(write) > 0:
            rol.update(write=list(set(rol.write + list(Services.objects(name__in=write)))))
        logger.info(f"Services added to role '{role}'")
        return True
    except Exception as e:
        logs(f"Failed to add services to role '{role}'",traceback.format_exc(), e)


def remSvcFrmRole(role, read=[], write=[]):
    try:
        rol = Role.objects(name=role).first()
        if len(read) > 0:
            rol.update(read=list(set(rol.read) -
                                 set(Services.objects(name__in=read))))
        if len(write) > 0:
            rol.update(write=list(set(rol.write) -
                                  set(Services.objects(name__in=write))))
        logger.info(f"Services removed from role '{role}'")
        return True
    except Exception as e:
        logs(f"Failed to remove services from role '{role}'",traceback.format_exc(), e)


def checkRoleUsage(role):
    try:
        usr = User.objects()
        return role in [r.name for u in usr for r in u.roles]
    except Exception as e:
        logs(f"Failed to check role usage for '{role}'",traceback.format_exc(), e)


def deleteRole(role):
    check = checkRoleUsage(role)
    if check == None:
        return None
    elif check:
        return False
    try:
        rol = Role.objects(name=role).first()
        rol.delete()
        logger.info(f"Role '{role}' deleted successfully")
        return True
    except Exception as e:
        logs(f"Failed to delete role '{role}'",traceback.format_exc(), e)


def checkAdminPrivilege(user):
    try:
        usr = User.objects(email=user).first()
        return 'admin' in [role.name for role in usr.roles]
    except Exception as e:
        logs(f"Failed to check admin privilege for user '{user}'",traceback.format_exc(), e)


def authenticateUser(user, passw):
    try:
        usr = User.objects(email=user).first()
        if not usr:
            return False
        return checkpw(passw.encode('utf8'), usr.password.encode('utf-8'))
    except Exception as e:
        logs(f"Failed to verify user '{user}'",traceback.format_exc(), e)


def verifyPermissions(user, svc, perm):
    try:
        roles = User.objects(email=user).first().roles
        for role in roles:
            if perm=='read' and sum(1 for s in role.read if s.name==svc)>0:
                return True
            if perm == 'write' and sum(1 for s in role.write if s.name==svc)>0:
                return True
        return False
    except Exception as e:
        logs("Failed to verify permissions",traceback.format_exc(), e)
