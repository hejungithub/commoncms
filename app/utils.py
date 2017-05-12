import logging
import logging.config

logging.config.fileConfig("logger.conf")
logger = logging.getLogger("example02")


class Utils(object):
    # log
    def test(self):
        pass
