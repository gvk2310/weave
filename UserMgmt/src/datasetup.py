from .db import db
from .log import logger

user = "admin@acc.com"
passw = "Admin@123"
roles = ["admin"]
read = ["svc1", "svc2"]
write = ["svc1", "svc2"]

db.createRole

if db.createRole(roles[0], read, write):
    logger.info('Role-"admin" Created')

    if db.createUser(user, passw, roles):
        logger.info('User - "admin@acc.com" created')
    else:
        logger.error('User - "admin@acc.com" creation failed')
else:
    logger.error('Role-"admin" Creation failed')
