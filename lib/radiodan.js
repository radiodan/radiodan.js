var mpdProcess = require('./mpd-process.js'),
    mpdClient = require('./mpd-client.js');

exports.instance = function (mpdConfig, radiodanConfig) {
  var instance = {};

  instance.start = function () {
    var process = mpdProcess.create(mpdConfig),
        client  = mpdClient.create(radiodanConfig, process.port),
        onStart = process.start();

    client.connect(onStart);
    client.playAllRandom();
  }.bind(instance);

  return instance;
};
