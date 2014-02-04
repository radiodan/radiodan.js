var winston = require('winston'),
    path    = require('path');

var logLevel = 'warn';

var sharedLogger = function(filename) {
  return new winston.Logger({
    level: logLevel,
    transports: [
      new winston.transports.Console({
        prettyPrint: true,
        timestamp: true,
        level: logLevel,
        label: path.basename(filename, '.js')
      })
    ]
  });
};

sharedLogger.setLevel = function (val) {
  logLevel = val;
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
