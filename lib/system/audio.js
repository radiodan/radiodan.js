'use strict';

var sprintf         = require('sprintf').sprintf,
    utils           = require('radiodan-client').utils,
    logger          = utils.logger('system-audio'),
    systemExec      = utils.promise.denodeify(require('child_process').exec),
    validateVolume  = require('../validators/actions/player/volume'),
    boundVolume     = require('../utils/bound-volume'),
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

function create(platform, exec) {
  var audioType, commands;

  platform        = platform    || process.platform;
  exec            = exec        || systemExec;

  audioType = audioTypeForPlatform(platform);

  if (audioType === false) {
    throw new Error('Cannot manage audio for '+platform);
  } else {
    logger.debug('audio type', audioType);
  }

  commands = volumeCommands[audioType];

  return {
    setVolume: setVolumeRequest,
    status: getVolume
  };

  function setVolumeRequest(params) {
    return validateVolume(params)
      .then(setVolume);
  }

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
}
