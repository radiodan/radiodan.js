module.exports = function(radio, command) {
  var mpdCommands = [['clear']];
  command.playlist.forEach(function(file) {
    mpdCommands.push(['add', file]);
  });

  mpdCommands.push(['random', '0']);

  if(command.playNow) {
    mpdCommands.push(['play', '0']);
  }

  return radio.sendCommands(mpdCommands);
};
