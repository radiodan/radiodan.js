'use strict';

var subject = require(libDir + 'player/mpd/states/volume');

describe('volume state', function() {
  it('requests current volume', function(done) {
    var radio         = sinon.stub(),
        volumePromise = utils.promise.resolve({volume: "100"}),
        invoker       = { invoke: sinon.stub().returns(volumePromise) },
        promise;

    promise = subject(radio, {state: invoker});

    assert.isFulfilled(promise).then(function(obj) {
      assert.equal(100, obj.volume);
      assert.ok(invoker.invoke.calledWith(radio, 'player'));
    }).then(done,done);
  });
});
