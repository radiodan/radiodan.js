/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

chai.use(chaiAsPromised);

var subject = require('../../../../lib/validators/actions/database/search');

describe('validate database search', function() {
  it('accepts valid search pairs', function(done) {
    var promise = subject({artist: "Kyuss"});

    assert.becomes(promise, { terms: ['artist', 'Kyuss'] }).notify(done);
  });

  it('accepts multiple search pairs', function(done) {
    var promise = subject({artist: "Fake Boys", album: "Pig Factory"});

    assert.becomes(promise,
      { terms: ['artist', 'Fake Boys', 'album', 'Pig Factory'] })
      .notify(done);
  });

  it('parses search values as strings', function(done) {
    var promise = subject({date: 1992});

    assert.becomes(promise,
      { terms: ['date', '1992'] })
      .notify(done);
  });

  it('ignores invalid terms', function(done) {
    var promise = subject({artist: "Adhesive", invalid: "term"});

    assert.becomes(promise,
      { terms: ['artist', 'Adhesive'] })
      .notify(done);
  });

  it('rejects if no valid terms are found', function(done) {
    var promise = subject({invalid: "term"});

    assert.isRejected(promise).notify(done);
  });
});
