var mpdProcess = require('./mpd-process.js'),
    mpd = require('./mpd.js');

exports.instance = function (mpdConfig, radiodanConfig) {
  var instance = {};

  instance.start = function () {
    var reportError = function(){ console.error(arguments)};
    var process = mpdProcess.create(mpdConfig),
        client = mpd.client(process.port),
        onStart = process.start();

    client.ready(onStart)
      .then(function() { return client.enqueue(); })
      .then(function() { return client.random('1') })
      .then(client.play)
      .fail(reportError);
  }.bind(instance);

  return instance;
};
