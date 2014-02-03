/*
  Given a Optimist-parsed argv object, return the
  corresponding radiodan command object or null
  if no command found.
*/
function commandForArg(argv) {
  var command;

  if (argv.volume) {
    command = argv.volume;
    command.action = 'volume';
  } else if (argv.random) {
    command = argv.random;
    command.action = 'random';
  } else if (argv.play && argv.play.stream) {
    command = {
      action: 'play',
      playNow: true,
      playlist: [ argv.play.stream ]
    }
  }
  return command;
}

module.exports = commandForArg;
