import os
from .. import app

app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['mongohost'],
    'connect': False
}
token_auth_url = os.environ['usermgmtUrl']
