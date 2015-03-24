'use strict';

var subject = require(libDir + 'player/mpd/actions/player/volume');

describe('volume action', function() {
  it('rejects unknown volume action types without sending commands',
    function(done) {
      var radio = { sendCommands: sinon.spy() };

      var volumePromise = subject(radio, {blah: 31});

      assert.isRejected(volumePromise, Error, "Volume Command not found")
        .then(function() {
          assert.equal(0, radio.sendCommands.callCount);
        })
        .then(done, done);
  });

  it('sends percentage value to mpd', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {value: 30});

    assert.ok(radio.sendCommands.calledWith([
        ['setvol', 30]
    ]));

    subject(radio, {value: 0});

    assert.ok(radio.sendCommands.calledWith([
        ['setvol', 0]
    ]), 'volume couldn\'t be set to 0');
  });

  it('bounds percentage high values to 100', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {value: 999999});

    assert.ok(radio.sendCommands.calledWith([
        ['setvol', 100]
    ]));
  });

  it('bounds percentage low values to 0', function() {
    var radio = { sendCommands: sinon.spy() };

    subject(radio, {value: -999999});

    assert.ok(radio.sendCommands.calledWith([
        ['setvol', 0]
    ]));
  });

  it('calculates differential value and sends to mpd', function(done) {
    var radio = { sendCommands: sinon.spy() },
        volumePromise = utils.promise.resolve({volume: "100"}),
        invoker = { invoke: sinon.stub().returns(volumePromise) },
        promise;

    promise = subject(radio, {diff: -30, state: invoker});

    assert.isFulfilled(promise).then(function() {
      // initial volume = 100, -30 = 70%
      assert.ok(radio.sendCommands.calledWith([
          ['setvol', 70]
      ]));

      assert.ok(invoker.invoke.calledWith(radio, 'player'));

      done();
    });
  });

  it('bounds differential values to range of 0-100', function(done) {
    var radio = { sendCommands: sinon.spy() },
        volumePromise = utils.promise.resolve({volume: "30"}),
        invoker = { invoke: sinon.stub().returns(volumePromise) },
        promise;

    promise = subject(radio, {diff: -40, state: invoker});

    assert.isFulfilled(promise)
      .then(function() {
        assert.ok(radio.sendCommands.calledWith([
            ['setvol', 0]
        ]));
      })
      .then(done, done);
  });
});

