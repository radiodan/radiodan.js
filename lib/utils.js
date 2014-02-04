var winston = require('winston');

var sharedLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      prettyPrint: true,
      level: 'warn'
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

function uuid() {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

module.exports = {
  logger: sharedLogger,
  failedPromiseHandler: failedPromiseHandler,
  uuid: uuid
}
