import os
from .. import app

app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['mongohost'],
    'connect': False
}
app.config['UPLOAD_FOLDER'] = 'temp'
jenkins_url = os.environ['jenkins_url']
jenkins_username = os.environ['jenkins_username']
jenkins_password = os.environ['jenkins_password']
jenkins_token = os.environ['jenkins_token']
onboarding_url = os.environ['onboarding_url']
token_auth_url = os.environ['usermgmtUrl']
