describe('state-emitter', function (){
  beforeEach(function(){
    this.subject = require(libDir + 'state-emitter');
  });

  it('returns a rejected promise if data is the same', function(done) {
    var data    = {test: 'data'},
        promise = this.subject.invoke('playlist', data, data, winston);

    assert.isRejected(promise, /Data is the same/).then(done,done);
  });
});
