module.exports = function(radio, command) {
  return radio.sendCommands([
      ['clear'], ['add', command.directory], ['random', '1'], ['play']
  ]);
};
