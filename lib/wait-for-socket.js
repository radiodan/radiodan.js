var net    = require('net');
    utils  = require('radiodan-client').utils,
    logger = utils.logger(__filename);

function create(port, socket) {
  var deferred = utils.promise.defer(),
      socket = socket || new net.Socket(),
      timeout = 1000;

  socket.setTimeout(2500);

  function addHandlers() {
    socket.on('connect', handleConnect);
    socket.on('error', handleError);
  }

  function handleConnect() {
    deferred.resolve(port);
  }

  function handleError() {
    logger.warn('Cannot connect');
    setTimeout(function () {
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
