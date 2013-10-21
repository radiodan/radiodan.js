var MPD = require('./mpd.js').MPD;

// spawn MPD
var mpd = new MPD();
mpd.ready().then(mpd.enqueue).then(mpd.play);

