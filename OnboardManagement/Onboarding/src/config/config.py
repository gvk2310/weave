import os
from .. import app

app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['mongohost'],
    'connect': False
}

app.config['upload_folder'] = 'tmp'
token_auth_url = os.environ['usermgmtUrl']