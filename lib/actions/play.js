module.exports = function(radio, command) {
  mpdCommands = [['clear'], ['add', command.playist], ['random', '0']];

  if(command.playNow) {
    mpdCommands.push(['play', '0']);
  }

  return radio.sendCommands([
     mpdCommands
  ]);
};
