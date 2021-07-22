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


def publish_onboard_events(event, data):
    try:
        client = redis.Redis(host=redis_host, port=redis_port)
        client.publish(event,json.dumps(data))
        return True
    except Exception as e:
        logger.error("Unable to publish message in redis")
        logger.debug(traceback.format_exc())
        logger.error(e)
