import os
from .. import app

#app.config['MONGODB_SETTINGS'] = {
#    'host': os.environ['mongohost'],
#    'connect': False
#}
app.config['upload_folder'] = 'tmp'
os.environ['onboardUrl'] = 'http://onboard-test.ethan.svc.cluster.local:80'
os.environ['deploymentUrl'] = 'http://deployment.ethan.svc.cluster.local:80'
