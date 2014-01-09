var Q = require('Q');
var net = require('net');
var logger = require('winston');

function create(port) {
  var deferred = Q.defer(),
      sock = new net.Socket();

  var onConnect = function() {
    logger.info('connected to '+port);
    deferred.resolve();
  };


  function connect() {
    sock.setTimeout(2500);

    sock.on('connect', this.onConnect);

    sock.on('error', function(error) {
      logger.error('error for '+port, error);

      setTimeout(function() {
        sock.connect(port);
      }, 10);
    });

    sock.connect(port);

    return deferred.promise;
  }

  return { onConnect: onConnect, connect: connect };
}

module.exports = {
  create: create
};
