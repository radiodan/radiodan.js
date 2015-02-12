'use strict';

describe('state-emitter/player', function (){
  beforeEach(function(){
    this.subject = require(libDir + 'state-emitters/player');
  });

  it('returns a object per non-matching key', function(done) {
    var newData = {a: '1', b: '2'},
        oldData = {a: '2', b: '2'},
        promise;

    promise = this.subject(oldData, newData);

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
});
