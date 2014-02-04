var winston = require('winston');

var sharedLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      prettyPrint: true,
      level: 'debug'
    })
  ]
});

sharedLogger.setLevel = function (val) {
  if (!val) { return; }

  Object.keys(sharedLogger.transports).forEach(function(key) {
    sharedLogger.transports[key].level = val;
  });
  sharedLogger.level = val;
}

function failedPromiseHandler(logger) {
  logger = logger || sharedLogger;

  return function(err) {
    logger.error(err.stack);
  };
}

module.exports = {
  logger: sharedLogger,
  failedPromiseHandler: failedPromiseHandler
}
