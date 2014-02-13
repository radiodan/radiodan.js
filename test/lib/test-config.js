/* globals describe, it, before */
'use strict';

var chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    sinon  = require('sinon');

var utils = require('radiodan-client').utils;

chai.use(chaiAsPromised);

var subject = require('../../lib/config');

describe('config', function (){
  it('uses an id from config');
  it('rejects malformed ids');
  it('creates a random id');
});
