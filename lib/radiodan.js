var MPD = require('./mpd.js').MPD;

var file = 'iTunes/iTunes Media/Music/Queens of the Stone Age/…Like Clockwork/02 I Sat By The Ocean.mp3';
var errorz = function(){ console.log('ERROR',arguements)};

// spawn MPD
var mpd = new MPD();
mpd.ready().then(function() { return mpd.enqueue(); }).then(mpd.play, errorz).fail(errorz);

