import logging
import platform


class HostnameFilter(logging.Filter):
    hostname = platform.node()

    def filter(self, record):
        record.hostname = HostnameFilter.hostname
        return True


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler(r'logs//events.log')
file_handler.addFilter(HostnameFilter())
formatter = logging.Formatter(
    '%(asctime)s | %(levelname)s | %(hostname)s | \
        [%(module)s %(funcName)s] | %(message)s')
file_handler.setFormatter(formatter)

stream_handler = logging.StreamHandler()
stream_handler.addFilter(HostnameFilter())
stream_handler.setFormatter(formatter)

logger.addHandler(file_handler)
