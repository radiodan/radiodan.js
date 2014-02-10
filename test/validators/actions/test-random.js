/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../../lib/validators/actions/random');

describe('validate random action', function() {
  it('resolves with correct options', function(done) {
    var promise = subject({ directory: 'music/is/good', unnecssary: true });

    assert.becomes(promise, { directory: 'music/is/good' })
          .notify(done);
  });

  it('rejects if directory not set', function(done) {
    var promise = subject({ unnecssary: true });

    assert.isRejected(promise, Error)
          .notify(done);
  });

  it('rejects if directory not string', function(done){
    var promise = subject({ directory: [] });
    assert.isRejected(promise, Error)
          .notify(done);
  });
});

