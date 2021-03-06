'use strict';

var net    = require('net'),
    utils  = require('radiodan-client').utils,
    logger = utils.logger(__filename);

function create(port, socket) {
  var deferred = utils.promise.defer(),
      retries  = 0,
      timeout  = 1000;

  socket = socket || new net.Socket();

  socket.setTimeout(2500);

  function addHandlers() {
    socket.on('connect', handleConnect);
    socket.on('error', handleError);
  }

  function handleConnect() {
    logger.debug(
      'Connected to ' + port + ' in ' + (retries+1) + ' attempt(s)'
    );
    deferred.resolve(port);
  }

  function handleError() {
    retries++;

    logger.warn('Cannot connect, attempt #' + retries);

    setTimeout(function () {
      socket.destroy();
      socket.connect(port);
    }, timeout);
  }

  function connect() {
    logger.debug('Connecting to port', port);
    addHandlers();
    socket.connect(port);
    return deferred.promise;
  }

  return {
    _addHandlers: addHandlers,
    connect: connect
  };
}

module.exports = {
  create: create
};
