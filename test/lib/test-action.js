/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

var utils = require('../../lib/utils');

chai.use(chaiAsPromised);

var subject = require('../../lib/action');

describe('action', function (){
  it('executes a matching action', function() {
    var mockActions = { "test": sinon.spy() },
        radio = sinon.spy(),
        options = sinon.spy();

    subject.actions = mockActions;

    subject.invoke(radio, 'test', options);
    assert.ok(mockActions.test.calledWith(radio, options));
  });

  it('returns a rejected promise if the action is not found', function() {
    var mockActions = {},
        radio = sinon.spy(),
        options = sinon.spy();

    subject.actions = mockActions;

    var promise = subject.invoke(radio, 'test', options);
    assert.isRejected(promise, Error);
  });
});
