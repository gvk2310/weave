import os
from .. import app

app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['mongohost'],
    'connect': False
}
app.config['upload_folder'] = 'tmp'
# os.environ['usermgmtUrl'] = 'http://dno-dev.acndevopsengineering.com/umg'
# os.environ['vaultToken'] = 'devnetops'
# os.environ['vaultUrl'] = 'http://ad7e35190743a44afa342e3a56d0691e-263186987.us-west-2.elb.amazonaws.com'
# os.environ['mongohost'] = 'mongodb://admin:password@ac7ee5b28e6584c96a7368c69ce74a74-1600605148.us-west-2.elb.amazonaws.com/devnetops37?authSource=admin'
# os.environ['secretkey'] = '200Gw5vUnsTZBmmRTLzuBiCwrr67Q88xDP-GxwH9CfWuqlWx3ZwNh85LdiatBLiqNX0'
# os.environ['request_header'] = 'Access-Control-Allow-Origin/*;Access-Control-Expose-Headers/access-control-allow-origin'
