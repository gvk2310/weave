import os
from .. import app


UPLOAD_FOLDER = './uploads'
app.config['SECRET_KEY'] = 'b6622e14a72744af5d991e5c6e262e9ba2f76c'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

