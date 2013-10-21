var mpd = require('./mpd.js');

var file = 'iTunes/iTunes Media/Music/Unknown Artist/Unknown Album/b-of-the-bang-15121.mp3';
var reportError = function(){ console.error(arguments)};

var config = {
  path: '/Users/andrew/.mpd/mpd.conf'
};

// spawn MPD
var mpd = mpd.client(config);
mpd.ready()
  .then(function() { return mpd.enqueue(file); })
  .then(mpd.play)
  .fail(reportError);

