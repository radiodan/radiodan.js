'use strict';

var utils = require('radiodan-client').utils,
    playlistInfo = function(radio, options) {
      return radio.sendCommands([['playlistinfo']])
        .then(function(response) {
          return formatResponse(radio, response);
        });
    };

playlistInfo.formatResponse = formatResponse;

module.exports = playlistInfo;

function formatResponse(radio, playlistInfo) {
  var playlistArray = radio.formatResponse(playlistInfo, true),
      playlist      = formatPlaylist(playlistArray);

  return utils.promise.resolve(playlist);
}

function formatPlaylist(playlist) {
  var output = [],
      playlistItem = {};

  playlist.forEach(function(line) {
    var key = line[0], value = line[1];

    if(key == 'file' && playlistItem.hasOwnProperty('file')) {
      output.push(playlistItem);
      playlistItem = {};
    }

    playlistItem[key] = value;
  });

  // If any properties have been added to item
  if( Object.keys(playlistItem).length > 0 ) {
    output.push(playlistItem);
  }

  return output;
}
