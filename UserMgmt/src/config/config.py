from .. import app

app.config['MONGODB_SETTINGS'] = {
        'host': 'mongodb://admin:password@mongo.devnetops.svc.cluster.local/devnetops?authSource=admin',
        'connect': False
                }
app.config['SECRET_KEY'] = 'b6622e14a72744af5d991e5c6e262e9ba2f76c'
app.config['SECURITY_PASSWORD_SALT'] = '4af5d991e5c6e262e9ba2f76c'
