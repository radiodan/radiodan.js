'use strict';

var Player = require(libDir + 'player/mpd');

describe('MpdPlayer', function() {
  describe('name', function() {
    it('should have a name', function() {
      assert.equal(Player.name, "MPD");
    });
  });

  describe('supportsPlayer', function() {
    it('should support the mpd player process', function() {
      assert.isTrue(Player.supportsPlayer('mpd'));
    });

    it('should support the mopidy player process', function() {
      assert.isTrue(Player.supportsPlayer('mopidy'));
    });

    it('should not support the vlc player process', function() {
      assert.isFalse(Player.supportsPlayer('vlc'));
    });
  });

  describe('player', function() {
    it('should have a player object', function() {
      assert.isObject(Player.player);
    });

    it('should create a new player', function() {
      var player = Player.player.create();
      assert.isObject(player);
    });
  });

  describe('action', function() {
    it('should have actions', function() {
      assert.isObject(Player.action);
    });

    it('should have action invoker', function() {
      assert.isFunction(Player.action.invoke);
    });
  });

  describe('state', function() {
    it('should have states', function() {
      assert.isObject(Player.state);
    });

    it('should have state invoker', function() {
      assert.isFunction(Player.state.invoke);
    });
  });
});
