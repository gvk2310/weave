import os
import base64
from .. import app

app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['mongohost'],
    'connect': False
}
mongohost = os.environ['mongohost']
#app.config['SECRET_KEY'] = os.environ['secretkey']
# app.config['JWT_SECRET_KEY'] = os.environ['jwtsecretkey']
mywd_iv = base64.b64decode(os.environ['MYWD_IV'])
mywd_key = base64.b64decode(os.environ['MYWD_KEY'])
service_user = os.environ['service_user']
service_key = os.environ['service_key']