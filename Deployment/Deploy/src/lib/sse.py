import os
import time
import json
import redis
import datetime
import traceback
from ..db import db
from ..log import logger


redis_url = os.environ['redis_url']
redis_host = redis_url.split(':')[0]
redis_port = redis_url.split(':')[1]


def publish_event_message(args, event='deploy'):
    payload = {'deployment_id': args['deployment_id'],
               'status': args['status'],
               'message': args['message']}
    if args['status'] not in ['DELETE_IN_PROGRESS', 'DELETE_COMPLETE']:
        data = db.get(id=args['deployment_id'])
        if not data:
            logger(f"Failed to publish sse for {args['deployment_id']}")
        payload['stage_info'] = data['stage_info']
    try:
        client = redis.Redis(host=redis_host, port=redis_port)
        client.publish(event, json.dumps(payload))
        return True
    except Exception as e:
        logger.error(
            f"Unable to publish message in redis for {args['deployment_id']}")
        logger.debug(traceback.format_exc())
        logger.error(e)
