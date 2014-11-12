var utils = require('radiodan-client').utils,
    state = require('../../state'),
    boundVolume = require('../../utils/bound-volume');

module.exports = function(radio, opts) {
  opts   = opts        || {};
  logger = opts.logger || utils.logger(__filename);
  state  = opts.state  || state;

  var command = opts,
      commandPromise = utils.promise.reject(new Error("Volume Command not found")),
      absoluteVol;

  if(command.hasOwnProperty('value')) {
    absoluteVol = command.value;

    commandPromise = radio.sendCommands([
      ['setvol', boundVolume(absoluteVol)]
    ]);
  } else if(command.diff) {
    commandPromise = state.invoke(radio, 'player')
                          .then(function(status) {
                            var currentVol = parseInt(status.volume, 10);
                            return radio.sendCommands([['setvol', boundVolume(currentVol, command.diff)]]);
                          }, utils.failedPromiseHandler());
  }

  return commandPromise;
};
