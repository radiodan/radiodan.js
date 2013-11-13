var mpdProcess = require('./mpd-process.js'),
    mpdClient = require('./mpd-client.js');

exports.instance = function (mpdConfig, radiodanConfig) {
  var instance = {},
      client;

  instance.start = function () {
    var process = mpdProcess.create(mpdConfig),
        onStart = process.start();

   client = mpdClient.create(radiodanConfig, process.port);

    client.connect(onStart);
    client.playAllRandom();
    instance.client = client;
  };

  return instance;
};
