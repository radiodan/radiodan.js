/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    winston = require('winston'),
    sinon  = require('sinon');

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

describe('state-emitter', function (){
  beforeEach(function(){
    this.subject = require('../../lib/state-emitter');
  });

  it('returns a object per non-matching key', function(done) {
    var newData = {a: '1', b: '2'},
        oldData = {a: '2', b: '2'},
        promise;

    promise = this.subject.invoke('player', newData, oldData);

    assert.isFulfilled(promise)
    .then(function(eventList) {
      assert.equal(1, eventList.length);
      assert.deepEqual({
        eventName: 'player.a',
        data: { old: '2', new: '1'}
      }, eventList[0]);
    })
    .then(done,done);
  });

  it('returns a rejected promise if data is the same', function(done) {
    var data    = {test: 'data'},
        promise = this.subject.invoke('playlist', data, data, winston);

    assert.isRejected(promise, /Data is the same/).then(done,done);
  });
});
