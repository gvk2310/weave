import os
import time
import redis
import datetime
from flask_restful import Resource
from ..log import logger
from flask import Response

redis_url = os.environ['redis_url']
redis_host = redis_url.split(':')[0]
redis_port = redis_url.split(':')[1]

class SSEGenerator:
    def __init__(self, event):
        #self.event = broadcast_type
        self.event = event
        self.closed = False
        self.expiry = datetime.datetime.now() + datetime.timedelta(minutes=5)
    def close(self):
        self.closed = True
    def __iter__(self):
        #event = 'onboard'
        client = redis.Redis(host=redis_host, port=redis_port)
        p = client.pubsub()
        p.subscribe(self.event)
        while not self.closed and datetime.datetime.now() < self.expiry:
            resp = p.get_message()
            if resp and not resp['data'] == 1:
                msg = resp['data'].decode('utf-8')
                payload = self.format_sse(data=msg, event=self.event)
                yield payload
            else:
                time.sleep(1)
    @staticmethod
    def format_sse(data, event):
        msg = f'data: {data}\n\n'
        if type:
            msg = f'event: {event}\n{msg}'
        return msg

class ServerEventMessage(Resource):
    #@verifyToken
    def get(self,event):
        stream = Response(SSEGenerator(event=event), mimetype="text/event-stream",
                          headers={'Cache-Control': 'no-cache'})
        return stream