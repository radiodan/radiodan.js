var utils      = require('radiodan-client').utils,
    mpdProcess = require('./mpd/mpd-process.js'),
    mpdClient  = require('./mpd/mpd-client.js');

exports.create = function (mpdConfig, radiodanConfig) {
  var instance = {};

  instance.start = function () {
    var process = mpdProcess.create(mpdConfig),
        onStart = process.start();

    instance.client = mpdClient.create(process.port);

    instance.client.id = utils.uuid();

    onStart.then(instance.client.connect);

    return instance.client;
  };

  return instance;
};
