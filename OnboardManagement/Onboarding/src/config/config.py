import os
from .. import app

# app.config['MONGODB_SETTINGS'] = {
#     'host': os.environ['mongohost'],
#     'connect': False
# }
app.config['MONGODB_SETTINGS'] = {
    'host': 'mongodb://admin:password@af3f48adff8c24e479f6c796b5c30649-1823806757.us-west-2.elb.amazonaws.com/devnetops?authSource=admin',
    'connect': True
}

app.config['upload_folder'] = 'tmp'
os.environ['usermgmtUrl'] = 'a3264125016ae466381ad4750a76c1d9-61246160.us-west-2.elb.amazonaws.com'
os.environ['vaultToken'] = 'devnetops'
os.environ['vaultUrl'] = 'http://af5758242e6514a229e4d596adb8c5cb-908081502.us-west-2.elb.amazonaws.com/'
os.environ['redis_url'] = '34.212.41.79:6379'

# os.environ['mongohost'] = 'mongodb://admin:password@ac7ee5b28e6584c96a7368c69ce74a74-1600605148.us-west-2.elb.amazonaws.com/devnetops37?authSource=admin'
# os.environ['secretkey'] = '200Gw5vUnsTZBmmRTLzuBiCwrr67Q88xDP-GxwH9CfWuqlWx3ZwNh85LdiatBLiqNX0'
# os.environ['request_header'] = 'Access-Control-Allow-Origin/*;Access-Control-Expose-Headers/access-control-allow-origin'
