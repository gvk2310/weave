from .. import app

app.config['MONGODB_DB'] = 'testnetops'
app.config['MONGODB_HOST'] = 'localhost'
app.config['MONGODB_PORT'] = 27017
app.config['SECRET_KEY'] = 'b6622e14a72744af5d991e5c6e262e9ba2f76c'
app.config['SECURITY_PASSWORD_SALT'] = '4af5d991e5c6e262e9ba2f76c'
