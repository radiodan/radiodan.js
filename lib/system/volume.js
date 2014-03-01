var sprintf         = require('sprintf').sprintf,
    MessagingClient = require('radiodan-client').MessagingClient,
    utils           = require('radiodan-client').utils,
    systemExec      = utils.promise.denodeify(
                        require('child_process').exec),
    validateVolume  = require('../validators/actions/player/volume'),
    topicKey        = 'command.system.volume',
    eventTopicKey   = 'system.volume',
    volumeCommands  = function() {
      var alsaDevice = "$(amixer | grep -o -m 1 \"'[^']*'\" | tr -d \"'\")";
      return {
        alsa: {
          set: "amixer set "+alsaDevice+" %d%% unmute",
          get: "amixer sget "+alsaDevice+" | grep -o -m 1 '[[:digit:]]*%' | tr -d '%'"
        },
        coreaudio: {
          set: "osascript -e 'set volume output volume %d'",
          get: "osascript -e 'output volume of (get volume settings)'"
        }
      };
    }();

module.exports = {listen: listen};

function listen(msgClient, platform, exec, logger) {
  var audioType, commands;

  messagingClient = msgClient   || MessagingClient.create();
  platform        = platform    || process.platform;
  exec            = exec        || systemExec;
  logger          = logger      || utils.logger('system-volume');

  audioType = audioTypeForPlatform(platform);

  if (audioType === false) {
    logger.warn("Cannot for "+platform);
    return false;
  } else {
    logger.debug('audio type', audioType);
  }

  commands = volumeCommands[audioType];

  messagingClient.createAndBindToExchange({
    exchangeName: 'radiodan',
    topicsKey: topicKey
  });

  messagingClient.on(topicKey, function(data){
    try {
      var replyToQueue  = data.properties.replyTo,
          correlationId = data.content.correlationId;
    } catch(err) {
      logger.warn("Cannot respond", err);
    }

    data.ack();

    utils.promise.spread(
        [ validateVolume(data.content), getVolume() ],
        setVolume
      )
      .then(getVolume)
      .then(respondToCommand(replyToQueue, correlationId))
      .then(emitVolume)
      .then(null, utils.failedPromiseHandler(logger));
  });

  function audioTypeForPlatform(platform) {
    switch(platform) {
      case 'darwin':
        return 'coreaudio';
      case 'freebsd':
      case 'linux':
      case 'sunos':
        //assume ALSA
        return 'alsa';
      default:
        logger.error('No known volume control method for '+platform);
        return false;
    }
  }

  function getVolume() {
    logger.debug(commands.get);
    return exec(commands.get);
  }

  function setVolume(newLevel, currentLevel) {
    var vol = newLevel.value,
        cmd;

    if(newLevel.diff) {
      vol = parseInt(currentLevel) + newLevel.diff;
    }

    cmd = sprintf(commands.set, parseInt(vol));

    logger.debug(cmd);
    return exec(cmd);
  }

  function respondToCommand(replyToQueue, correlationId) {
    return function (vol) {
      if(typeof replyToQueue === 'undefined') {
        logger.warn("Cannot reply, queue undefined");
      } else {
        var msg = {
          correlationId: correlationId,
          response: {volume: parseInt(vol)}
        };

        logger.debug("replying", replyToQueue, msg);
        messagingClient.sendToQueue(replyToQueue, msg);
      }

      return vol;
    }
  }

  function emitVolume(vol) {
    var msg = {value: parseInt(vol)};
    return messagingClient.sendToExchange(
      'radiodan', eventTopicKey, msg
    );
  }
}
