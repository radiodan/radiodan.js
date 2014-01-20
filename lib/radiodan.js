var mpdProcess = require('./mpd-process.js'),
    mpdClient  = require('./mpd-client.js');

exports.create = function (mpdConfig, radiodanConfig) {
  var instance = {};

  instance.start = function () {
    var process = mpdProcess.create(mpdConfig),
        onStart = process.start();

    instance.client = mpdClient.create(process.port);

    onStart.then(instance.client.connect);

    return instance.client;
  };

  return instance;
};
