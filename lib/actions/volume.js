var winston = require('winston'),
    utils = require('../utils');

function boundVolume(vol) {
  if(vol < 0) {
    vol = 0;
  } else if(vol > 100) {
    vol = 100;
  }
  return vol;
}

module.exports = function(radio, command, logger) {
  logger = logger || winston;

  var commandPromise;

  if(command.hasOwnProperty('value')) {
    var absoluteVol = parseInt(command.value);

    commandPromise = radio.sendCommands([
      ['setvol', boundVolume(absoluteVol)]
    ]);
  } else if(command.hasOwnProperty('diff')) {
    commandPromise = radio.status()
      .then(function(status) {
        var volume = status.volume;
        var newVol = parseInt(volume)+parseInt(command.diff);

        return radio.sendCommands([['setvol', boundVolume(newVol)]]);
      }, utils.failedPromiseHandler());
  }

  return commandPromise;
};
