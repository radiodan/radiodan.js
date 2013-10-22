var mpd = require('./mpd.js');

exports.instance = function (config) {
  var instance = {};

  instance.start = function () {
    var reportError = function(){ console.error(arguments)};
    var client = mpd.client(config);
    client.ready()
      .then(function() { return client.enqueue(); })
      .then(function() { return client.random('1') })
      .then(client.play)
      .fail(reportError);
  }.bind(instance);

  return instance;
};
