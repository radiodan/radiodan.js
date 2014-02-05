var net    = require('net');
    utils  = require('./utils');

function create(port, socket) {
  var deferred = utils.promise.defer(),
      socket = socket || new net.Socket(),
      timeout = 10;

  socket.setTimeout(2500);

  function addHandlers() {
    socket.on('connect', handleConnect);
    socket.on('error', handleError);
  }

  function handleConnect() {
    deferred.resolve();
  }

  function handleError() {
    setTimeout(function () {
      socket.connect(port);
    }, timeout);
  }

  function connect() {
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
