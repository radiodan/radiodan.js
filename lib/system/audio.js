var sprintf         = require('sprintf').sprintf,
    MessagingClient = require('radiodan-client').MessagingClient,
    utils           = require('radiodan-client').utils,
    systemExec      = utils.promise.denodeify(
                        require('child_process').exec),
    validateVolume  = require('../validators/actions/player/volume'),
    boundVolume = require('../utils/bound-volume'),
    volumeCommands  = function() {
      var alsaDevice = "$(amixer | grep -o -m 1 \"'[^']*'\" | tr -d \"'\")";
      return {
        alsa: {
          set: "amixer -M set "+alsaDevice+" %d%% unmute | grep -o -m 1 '[[:digit:]]*%%' | tr -d '%%'",
          get: "amixer -M sget "+alsaDevice+" | grep -o -m 1 '[[:digit:]]*%' | tr -d '%'"
        },
        coreaudio: {
          set: "osascript -e 'set volume output volume %d'; osascript -e 'output volume of (get volume settings)'",
          get: "osascript -e 'output volume of (get volume settings)'"
        }
      };
    }();

module.exports = {create: create};

function create(id) {
  var topicKey        = 'command.audio.'+id;
      eventTopicKey   = 'event.audio.'+id+'.volume';

  return { listen: listen };

  function listen(msgClient, platform, exec, logger) {
    var audioType, commands;

    messagingClient = msgClient   || MessagingClient.create();
    platform        = platform    || process.platform;
    exec            = exec        || systemExec;
    logger          = logger      || utils.logger('system-audio');

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
      var action, replyToQueue, correlationId;

      try {
        action        = data.content.action;
        replyToQueue  = data.properties.replyTo;
        correlationId = data.content.correlationId;
      } catch(err) {
        logger.warn("Cannot respond", err);
      }

      data.ack();

      switch(action) {
        case "volume":
          return respondToVolume();
        case "status":
          return respondToStatus();
        default:
          logger.error("Unknown action", action);
      }

      function respondToVolume() {
        return validateVolume(data.content)
          .then(setVolume)
          .then(
            respondToCommand(replyToQueue, correlationId),
            respondToCommand(replyToQueue, correlationId, true)
          )
          .then(emitVolume)
          .then(null, utils.failedPromiseHandler(logger));
      }

      function respondToStatus() {
        return getVolume().then(
          respondToCommand(replyToQueue, correlationId),
          respondToCommand(replyToQueue, correlationId, true)
        ).then(null, utils.failedPromiseHandler(logger));
      }
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

    function setVolume(newLevel) {
      if(newLevel.diff) {
        return getVolume()
          .then(function(currentLevel) {
            var vol = boundVolume(
              parseInt(currentLevel, 10), newLevel.diff
            );

            return utils.promise.resolve(vol);
          })
          .then(setVolumeExec);
      } else {
        return setVolumeExec(newLevel.value);
      }
    }

    function setVolumeExec(volume) {
      var cmd = sprintf(commands.set, parseInt(volume, 10));

      logger.debug(cmd);
      return exec(cmd);
    }

    function respondToCommand(replyToQueue, correlationId, error) {
      if(typeof replyToQueue === 'undefined') {
        var replyErr = "Cannot reply, queue undefined";
        logger.warn(replyErr);
        return utils.promise.reject(replyErr);
      }

      error = (error === true);

      return function (response) {
        var msg = {
          correlationId: correlationId,
          error: error
        };

        if(error) {
          msg.error = response.toString();
        } else {
          msg.response = {volume: parseInt(response, 10)};
        }

        logger.debug("replying", replyToQueue, msg);
        messagingClient.sendToQueue(replyToQueue, msg);

        if(error) {
          return utils.promise.reject(response.toString());
        } else {
          return response;
        }
      };
    }

    function emitVolume(vol) {
      var msg = {value: parseInt(vol, 10)};

      return messagingClient.sendToExchange(
        'radiodan', eventTopicKey, msg
      );
    }
  }
}
