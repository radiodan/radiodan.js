'use strict';

var os    = require('os'),
    path  = require('path'),
    utils = require('radiodan-client').utils,
    mergeObjects   = utils.mergeObjects,
    radiodanPath   = "/var/lib/radiodan/radios/",
    systemDefaults = require(__dirname+'/../../radiodan-defaults.json');

module.exports = {create: create};

function create(defaultPath, platform) {
  var rootPath = defaultPath || radiodanPath,
      platformDefaults = {};

  platform = platform || os.platform();

  if(platform === 'darwin') {
    platformDefaults.osx = true;
  } else {
    platformDefaults.linux = true;
  }

  return { add: addDefaults };

  function addDefaults(config) {
    var newConfig;

    config = config || {};

    var radioPath = path.join(rootPath, config.id.toString()),
        configDefaults = mergeObjects({
          id:       config.id,
          music:    path.join(radioPath, "music/"),
          playlist: path.join(radioPath, "playlists/"),
          db:       path.join(radioPath, "mpd.db"),
        }, platformDefaults);

    configDefaults = mergeObjects(systemDefaults, configDefaults);
    newConfig      = mergeObjects(configDefaults, config);

    return newConfig;
  }
}
