var assert = require("assert"),
    sinon  = require("sinon"),
    EventEmitter = require("events").EventEmitter,
    net    = require("net");

var subject = require("../lib/mpd-process");

describe('mpdProcess', function(){

  describe('locating the mpd binary', function () {
    it('finds the first mpd binary on the system');
    it('rejects the promise if no mpd binary is found');
  });

  describe('spawning a child mpd process', function () {
    it('spawns using the correct binary');
    it('fulfills the promise on successful spawning');
    it('rejects the promise on spawning error');
  });

  describe('logging output from the mpd process', function () {
    it('logs stdout from the child process');
    it('logs stderr from the child process');
  });

});
