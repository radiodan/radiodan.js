var Q = require('q');

/*
  Given a Optimist-parsed argv object, return the
  corresponding radiodan command object or null
  if no command found.
*/
function commandForArg(argv, radio) {
  var promise = Q.reject();

  if (argv.volume) {
    promise = radio.volume(argv.volume)
  } else if (argv.random) {
    promise = radio.playRandom(argv.random);
  } else if (argv.database) {
    promise = radio.updateDatabase();
  } else if (argv.play && argv.play.stream) {
    promise = radio.play({
      playNow: true,
      playlist: [ argv.play.stream ]
    });
  }

  return promise;
}

module.exports = commandForArg;
