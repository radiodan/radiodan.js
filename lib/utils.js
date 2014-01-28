var winston = require('winston');

function failedPromiseHandler(logger) {
  logger = logger || winston;

  return function(err) {
    logger.error(err);
  };
}

module.exports = {
  failedPromiseHandler: failedPromiseHandler
}
