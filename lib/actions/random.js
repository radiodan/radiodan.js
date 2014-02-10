var utils = require('radiodan-client').utils;

module.exports = function(radio, options) {
  return radio.sendCommands([
      ['clear'], ['add', options.directory], ['random', '1'], ['play']
  ]);
};
