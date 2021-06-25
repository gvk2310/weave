import os
from .. import app

app.config['upload_folder'] = 'tmp'
token_auth_url = os.environ['usermgmtUrl']
