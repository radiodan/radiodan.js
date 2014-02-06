var utils = require('../utils');

module.exports = function(radio, command) {
  if(command.directory) {
    return radio.sendCommands([
        ['clear'], ['add', command.directory], ['random', '1'], ['play']
    ]);
  } else {
    return utils.promise.reject('Directory not found');
  }
};
