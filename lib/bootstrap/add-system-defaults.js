var os    = require('os'),
    path  = require('path'),
    utils = require('radiodan-client').utils,
    mergeObjects   = utils.mergeObjects,
    radiodanPath   = "/var/lib/radiodan/radios/",
    systemDefaults = {
      log: "syslog",
      httpStreaming: false
    };

if(os.platform() === 'darwin') {
  systemDefaults.platform = "coreAudio";
} else {
  systemDefaults.platform = "alsa";
}

module.exports = {create: create};

function create(defaultPath) {
  var rootPath = defaultPath || radiodanPath;

  return { add: addDefaults };

  function addDefaults(config) {
    var radioPath = path.join(rootPath, config.id.toString()),
        configDefaults = {
          id:       config.id,
          music:    path.join(radioPath, "music/"),
          playlist: path.join(radioPath, "playlists/"),
          db:       path.join(radioPath, "mpd.db"),
        };

    var configDefaults = mergeObjects(systemDefaults, configDefaults),
        newConfig      = mergeObjects(configDefaults, config);

    return newConfig;
  };
}
