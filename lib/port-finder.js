var portfinder = require('portfinder'),
    utils      = require('radiodan-client').utils;

//http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Dynamic.2C_private_or_ephemeral_ports
portfinder.basePort = 49152;

module.exports.create = function(){
  var instance = {};

  instance.next = function(numPorts) {
    var portPromises = [],
        portCount = parseInt(numPorts);

    for(i=0; i<portCount; i++) {
      var p = utils.promise.nfcall(portfinder.getPort);
      portPromises.push(p);
    }

    return utils.promise.all(portPromises);
  };

  return instance;
};
