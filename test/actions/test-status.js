/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../lib/actions/status');

describe('status action', function() {
  it('requests current status', function() {
    var statusPromise = utils.promise.resolve(),
        radio = { sendCommands: sinon.stub().returns(statusPromise) };

    subject(radio);

    assert.equal(1, radio.sendCommands.callCount);
    assert.ok(radio.sendCommands.calledWith([
      ['status']
    ]));
  });

  it('formats status string into object', function(done) {
    var statusString = sinon.stub(),
        statusPromise = utils.promise.resolve(statusString),
        radio = {
          sendCommands: sinon.stub().returns(statusPromise),
          formatResponse: sinon.spy()
        };

    var promise = subject(radio);

    assert.isFulfilled(promise).then(function(response) {
      assert.ok(radio.formatResponse.calledWith(statusString));
      done();
    });
  });
});

