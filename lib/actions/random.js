var utils = require('../utils');

module.exports = function(radio, options) {
  if(options.directory) {
    return radio.sendCommands([
        ['clear'], ['add', options.directory], ['random', '1'], ['play']
    ]);
  } else {
    return utils.promise.reject('Directory not found');
  }
};
