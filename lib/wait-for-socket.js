var Q = require('Q');
var net = require('net');
var logger = require('winston');

function create(port, socket) {
  var deferred = Q.defer(),
      sock = socket || new net.Socket();

  function addHandlers() {
    sock.on('connect', function () {});
    sock.on('error', function () {});
  }

  function handleConnect() {

  }

  function handleError() {

  }

  function connect() {
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
