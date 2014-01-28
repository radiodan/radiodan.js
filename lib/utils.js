var winston = require('winston');

function failedPromiseHandler(logger) {
  logger = logger || winston;

  return function(err) {
    logger.error(err.stack);
  };
}

module.exports = {
  logger: winston,
  failedPromiseHandler: failedPromiseHandler
}
