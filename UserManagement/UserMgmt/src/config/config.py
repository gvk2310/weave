import os
from .. import app

app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['mongohost'],
    'connect': False
}
#app.config['SECRET_KEY'] = os.environ['secretkey']
#app.config['JWT_SECRET_KEY'] = os.environ['jwtsecretkey']
