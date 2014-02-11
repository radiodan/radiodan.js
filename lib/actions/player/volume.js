var utils = require('radiodan-client').utils,
    state = require('../../state'),
    defaultLogger = utils.logger(__filename);

function boundVolume(vol) {
  if(vol < 0) {
    vol = 0;
  } else if(vol > 100) {
    vol = 100;
  }
  return vol;
}

module.exports = function(radio, opts) {
  opts   = opts        || {};
  logger = opts.logger || defaultLogger;
  state  = opts.state  || state;

  var command = opts,
      commandPromise = utils.promise.reject(new Error("Volume Command not found")),
      absoluteVol;

  if(command.value) {
    absoluteVol = command.value;

    commandPromise = radio.sendCommands([
      ['setvol', boundVolume(absoluteVol)]
    ]);
  } else if(command.diff) {
    commandPromise = state.invoke(radio, 'player')
                          .then(function(status) {
                            var volume = parseInt(status.volume);
                            var newVol = volume + command.diff;

                            return radio.sendCommands([['setvol', boundVolume(newVol)]]);
                          }, utils.failedPromiseHandler());
  }

  return commandPromise;
};
