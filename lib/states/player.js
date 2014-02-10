var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  return radio.sendCommands([['status']]).then(function(status) {
    return utils.promise.resolve(radio.formatResponse(status));
  });
};
