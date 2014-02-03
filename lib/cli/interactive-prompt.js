var readline = require('readline'),
    EventEmitter = require('events').EventEmitter,
    commandForArg = require('./command-for-arg');

/*
  Starts an interactive command prompt
  for options
*/
function interactiveCommandPrompt(program) {

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var instance = new EventEmitter();

  rl.write('Interactive mode\n');
  rl.write('Enter commands to send to this radio\n');
  rl.write('Type exit to quit\n');
  rl.write('  e.g. --volume.value=10\n');
  rl.prompt('>');

  // Process input line
  rl.on('line', function (cmd) {
    var command = processInputLine(cmd, program);

    if (command) {
      instance.emit('command', command);
    } else {
      console.log('Error: Command not found');
    }
  });

  instance.done = function() {
    rl.prompt('>');
  };

  return instance;
}

/*
  Process a string of input from readline
  and execute commands found
*/
function processInputLine(cmd, program) {
  var args,
      opts,
      command;

  if (cmd === 'exit') {
    console.log('Goodbye.\n');
    process.exit();
  }

  // Merge args with those passed into command
  // to ensure that any required options are supplied
  args = cmd.split(' ')
            .concat(process.argv);

  opts    = program.parse(args);
  command = commandForArg(opts);

  if (command) {
    return command;
  } else {
    return false;
  }
}

module.exports = interactiveCommandPrompt;
