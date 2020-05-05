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


def getUsers():
    try:
        return [{
            "email": usr.email,
            "roles": [role.name for role in usr.roles]}
            for usr in User.objects()
        ]
    except Exception as e:
        logger.error('Unable to retrieve user list')
        logger.debug(traceback.format_exc())
        logger.error(e)


def createUser(name,user, passw, roles):
    try:
        if len(roles) != len(rols:=Role.objects(name__in=roles)):
            return False
        # roles = Role.objects(name__in=roles)
        usr = User(email=user, password=hashpw(
            passw.encode('utf-8'), gensalt()), roles=rols,name=name)
        usr.save()
        logger.info(f"User '{user}' created with roles '{','.join(roles)}'")
        return True
    except Exception as e:
        logger.error(f"Failed to create user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def changePass(user, passw):
    try:
        usr = User.objects(email=user).first()
        usr.update(password=hashpw(passw.encode('utf-8'), gensalt()).decode('utf-8'))
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
        if len(roles) != len(rols:=Role.objects(name__in=roles)):
            return False
        usr = User.objects(email=user).first()
        new_roles = usr.roles + list(rols)
        usr.update(roles=new_roles)
        logger.info(
            f"New roles - {','.join(roles)} added to the user '{user}'")
        return True
    except Exception as e:
        logger.error(f"Unable to add new roles to the user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def removeRoleFrmUser(user, roles):
    try:
        usr = User.objects(email=user).first()
        new_roles = list(set(usr.roles) - set(Role.objects(name__in=roles)))
        usr.update(roles=new_roles)
        logger.info(
            f"Roles - '{','.join(roles)}' has been removed from the user '{user}'")
        return True
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


def getServices():
    try:
        return [svc.name for svc in Services.objects()]
    except Exception as e:
        logger.error("Unable retrieve service list")
        logger.debug(traceback.format_exc())
        logger.error(e)


def createSvc(name):
    try:
        svc = Services(name=name)
        svc.save()
        addSvcToRole('admin', read=[name], write=[name])
        logger.info(f"Service '{name}' has been created")
        return True
    except Exception as e:
        logger.error(f"Failed to create service {name}")
        logger.debug(traceback.format_exc())
        logger.error(e)


def checkSvcUsage(svc):
    try:
        for ob in Role.objects(name__ne='admin'):
            if svc in [obj.name for obj in (ob.read + ob.write)]:
                return True
        return False
    except Exception as e:
        logger.error(f"Unable to check if service '{svc}' is in use")
        logger.debug(traceback.format_exc())
        logger.error(e)


def deleteSvcs(svc):
    if (check:=checkSvcUsage(svc)) == None:
        return None
    elif check == True:
        return False
    try:
        remSvcFrmRole('admin', read=[svc], write=[svc])
        Services.objects(name=svc).delete()
        return True
    except Exception as e:
        logger.error(f"Unable to delete service '{svc}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


def getRoles():
    try:
        msg = [{"name": role.name,
                "read": [item.name for item in role.read],
                "write":[item.name for item in role.write]}
               for role in Role.objects()]
        return msg
    except Exception as e:
        logger.error(f"Unable to retrieve role list")
        logger.debug(traceback.format_exc())
        logger.error(e)


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
        logger.error(f"Failed to create role '{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


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
        logger.error(f"Failed to add services to role '{role}'")
        logger.debug(traceback.format_exc())
        logger.error(e)


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
        logger.error(f"Failed to remove services from role '{role}'")
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
    if (check:=checkRoleUsage(role)) == None:
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


def authenticateUser(user, passw):
    try:
        if not (usr:=User.objects(email=user).first()):
            return False
        return checkpw(passw.encode('utf8'), usr.password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Failed to verify user '{user}'")
        logger.debug(traceback.format_exc())
        logger.error(e)
