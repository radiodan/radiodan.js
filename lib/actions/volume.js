module.exports = function(radio, command) {
  var commandPromise;

  if(command.hasOwnProperty('value')) {
    var absoluteVol = parseInt(command.value);

    if(absoluteVol < 0) {
      absoluteVol = 0;
    } else if(absoluteVol > 100) {
      absoluteVol = 100;
    }

    commandPromise = radio.sendCommands([
        ['setvol', [absoluteVol]]
        ]);
  } else if(command.hasOwnProperty('diff')) {
    commandPromise = radio.sendCommands([['status']])
      .then(function(statusString) {
        var volume = statusString.match(/volume: (\d{1,3})$/m)[1];
        var newVol = parseInt(volume)+parseInt(command.diff);
        logger.info('newVol', newVol);

        return radio.sendCommands([['setvol', newVol]]);
      });
  }

  return commandPromise;
};
