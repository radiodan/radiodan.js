var utils = require('radiodan-client').utils,
    os    = require('os'),
    radiodanPath = "/var/lib/radiodan/radios/",
    systemDefaults = {
      log: "syslog",
      httpStreaming: false  
    };

if(os.platform === 'darwin') {
  systemDefaults.platform = "coreAudio";
} else {
  systemDefaults.platform = "alsa";
}

module.exports = function (config) {
  var path = radiodanPath+config.id,
      configDefaults = {
        id: config.id,
        music: path+"/music",
        playlist: path+"/playlists",
        db: path+"/mpd.db",
      };
  
  var configDefaults = utils.mergeObjects(systemDefaults, configDefaults),
      newConfig      = utils.mergeObjects(configDefaults, config);
  
  return newConfig;
};