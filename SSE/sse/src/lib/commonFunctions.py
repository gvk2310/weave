import requests
from flask_restful import request
from functools import wraps
from ..config.config import token_auth_url



def verify_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        resp = requests.get(f"{token_auth_url}/isvalidrequest",
                            cookies=request.cookies)
        if resp.status_code != 200:
            return resp.json(), resp.status_code
        return func(*args, **kwargs)

    return wrapper
