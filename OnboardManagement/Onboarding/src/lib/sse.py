import os
import time
import json
import redis
import datetime
import traceback
from ..log import logger

redis_url = os.environ['redis_url']
redis_host = redis_url.split(':')[0]
redis_port = redis_url.split(':')[1]


class SSEGenerator:
    def __init__(self, type):
        #self.event = broadcast_type
        self.event = type
        self.closed = False
        self.expiry = datetime.datetime.now() + datetime.timedelta(minutes=30)

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


def publish_onboard_events(**kwargs):
    try:
        client = redis.Redis(host=redis_host, port=redis_port)
        client.publish(json.dumps(kwargs))
        return True
    except Exception as e:
        logger.error("Unable to publish message in redis")
        logger.debug(traceback.format_exc())
        logger.error(e)
