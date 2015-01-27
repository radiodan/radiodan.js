'use strict';

var readline = require('readline'),
    EventEmitter = require('events').EventEmitter,
    sendCommand = require('./send-command');

/*
  Starts an interactive command prompt
  for options
*/
function interactiveCommandPrompt(program, radio) {

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var instance = new EventEmitter();

  rl.write('Interactive mode\n');
  rl.write('Enter commands to send to this radio\n');
  rl.write('Type exit to quit\n');
  rl.write('  e.g. player.volume diff=-10\n');
  rl.prompt('>');

  // Process input line
  rl.on('line', function (cmd) {
    if (processInputLine(cmd.trim(), program, radio)) {
      instance.emit('command');
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
function processInputLine(cmd, program, radio) {
  var command, options;

  if (cmd === 'exit') {
    console.log('Goodbye.\n');
    process.exit();
  }

  // Merge args with those passed into command
  // to ensure that any required options are supplied
  command = cmd.split(' ')[0];
  options = cmd.split(' ')[1];

  return sendCommand(radio, command, options);
}

module.exports = interactiveCommandPrompt;
