import os
import base64
import uuid
from .. import app

app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['mongohost'],
    'connect': False
}

mongohost = os.environ['mongohost']
jwt_secret = str(uuid.uuid4())
mywd_iv = base64.b64decode(os.environ['MYWD_IV'])
mywd_key = base64.b64decode(os.environ['MYWD_KEY'])
service_user = os.environ['service_user']
service_key = os.environ['service_key']
app.config['native_token'] = os.environ['Native_Token']

