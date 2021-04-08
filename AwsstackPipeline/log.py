import logging
import platform


class HostnameFilter(logging.Filter):
    hostname = platform.node()

    def filter(self, record):
        record.hostname = HostnameFilter.hostname
        return True


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
formatter = logging.Formatter(
    '%(asctime)s | %(levelname)s | %(hostname)s | \
        [%(module)s %(funcName)s] | %(message)s')

stream_handler = logging.StreamHandler()
stream_handler.addFilter(HostnameFilter())
stream_handler.setFormatter(formatter)

logger.addHandler(stream_handler)
