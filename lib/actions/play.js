module.exports = function(radio, command) {
  mpdCommands = [['clear'], ['add', command.playlist], ['random', '0']];

  if(command.playNow) {
    mpdCommands.push(['play', '0']);
  }

  return radio.sendCommands([
     mpdCommands
  ]);
};
