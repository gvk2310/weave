import os
from .. import app

#app.config['MONGODB_SETTINGS'] = {
#    'host': os.environ['mongohost'],
#    'connect': False
#}
app.config['upload_folder'] = 'tmp'
# os.environ['usermgmtUrl'] = 'http://dno-dev.acndevopsengineering.com/umg'
