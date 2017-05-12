import logging
import logging.config

logging.config.fileConfig("logger.conf")
logger = logging.getLogger("logfile")


class Utils(object):
    # log
    def test(self):
        pass
