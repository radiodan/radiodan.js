'use strict';

module.exports = function (currentVol, diff) {
  var vol;

  diff = diff || 0;
  vol = currentVol + diff;
  if(vol < 0) {
    vol = 0;
  } else if(vol > 100) {
    vol = 100;
  }

  return vol;
};
