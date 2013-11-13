var Q      = require('q'),
    logger = require('winston');

module.exports = function(executeCommand) {
  var validCommands = ['play', 'pause', 'stop', 'next', 'prev', 'add',
      'random', 'status', 'playlist'];

  return function (command, defaults) {
    command = command.toLowerCase();
    defaults = defaults || [];

    var executable = function(args) {
      if(executable.valid()) {
        var params = executable.params(args);
        logger.info('mpdCommand '+params);

        return executeCommand.apply(null, params);
      } else {
        var failedPromise = Q.defer(),
          failure = 'mpdCommand '+command+' invalid, will not be processed';

        //logger.warn(failure);
        failedPromise.reject(failure);

        return failedPromise.promise;
      }
    };

    executable.defaults = function(newDefaults) {
      if(typeof newDefaults !== 'undefined') {
        defaults = newDefaults;
      }

      return defaults;
    };

    executable.params = function(args) {
      args = args || defaults;
      return [command, args];
    };

    executable.valid = function() {
      return validCommands.indexOf(command) !== -1;
    };

    return executable;
  };
};
