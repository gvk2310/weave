import os
import json
import redis
import queue
import datetime
import traceback
from ..log import logger
from threading import Thread, ThreadError

redis_url = os.environ['redis_url']
redis_host = redis_url.split(':')[0]
redis_port = redis_url.split(':')[1]


class SSE:


    def __init__(self):
        self.listeners = []
        self.listener_expiry = {}

    def listen(self):
        q = queue.Queue(maxsize=3)
        self.listeners.append(q)
        self.listener_expiry[q] = datetime.datetime.now() + datetime.timedelta(
            minutes=30)
        return q

    def stream(self, msg):
        for i in reversed(range(len(self.listeners))):
            try:
                if datetime.datetime.now() > self.listener_expiry[
                    self.listeners[i]]:
                    self.listeners[i].put_nowait('End-Of-Stream')
                    del self.listener_expiry[self.listeners[i]]
                    del self.listeners[i]
                else:
                    self.listeners[i].put_nowait(msg)
            except queue.Full:
                del self.listeners[i]


sse = SSE()


def format_sse(data, event):
    msg = f'data: {data}\n\n'
    if event:
        msg = f'event: {event}\n{msg}'
    return msg


def load_channel():
    try:
        event = 'deploy'
        client = redis.Redis(host=redis_host, port=redis_port)
        p = client.pubsub()
        p.subscribe(event)
        for resp in p.listen():
            if resp and not resp['data'] == 1:
                msg = resp['data'].decode('utf-8')
                payload = format_sse(data=msg, event=event)
                sse.stream(payload)
    except Exception as e:
        logger.error("Unable to get message from redis")
        logger.debug(traceback.format_exc())
        logger.error(e)


def publish_event_message(args, event='deploy'):
    payload = {'deployment_id': args['deployment_id'],
               'status': args['status'],
               'message': args['message']}
    try:
        client = redis.Redis(host=redis_host, port=redis_port)
        client.publish(event, json.dumps(payload))
        return True
    except Exception as e:
        logger.error("Unable to publish message in redis")
        logger.debug(traceback.format_exc())
        logger.error(e)


def stream_response():
    messages = sse.listen()
    while True:
        msg = messages.get()
        if msg == 'End-Of-Stream':
            break
        yield msg


try:
    Thread(target=load_channel).start()
except ThreadError as e:
    logger.error(e)
