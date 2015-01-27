'use strict';

var path = require('path'),
    subject = require(libDir + 'bootstrap/create-paths');

describe('bootstrap/create-paths', function() {
  before(function() {
    this.mockPath  = path;
    this.mockMkdir = { sync: sinon.spy() };

    try {
      // grunt sometimes chokes on this
      sinon.spy(this.mockPath, 'resolve');
      sinon.spy(this.mockPath, 'dirname');
    } catch(err) {
    }
  });

  beforeEach(function() {
    //reset count for all mocks
    this.mockPath.resolve.reset();
    this.mockPath.dirname.reset();
    this.mockMkdir.sync.reset();
  });

  it('creates directories', function() {
    var mockPath = this.mockPath,
        mockMkdir = this.mockMkdir,
        paths = {music: '/tmp/radiodan/music'};

    subject(paths, null, mockPath, mockMkdir);

    // check it attempts to resolve the given path
    assert.ok(mockPath.resolve.calledWith('/tmp/radiodan/music'));

    // check it creates the given directory
    assert.equal(mockMkdir.sync.callCount, 1, 'mockMkDir#sync');
    assert.equal(
      mockMkdir.sync.firstCall.args,
      '/tmp/radiodan/music'
    );
  });

  it('creates containing path for files', function() {
    var mockPath = this.mockPath,
        mockMkdir = this.mockMkdir,
        paths = {log: '/tmp/radiodan/log/radiodan.log'};

    subject(paths, null, mockPath, mockMkdir);

    // check it creates the directory
    assert.equal(mockMkdir.sync.callCount, 1, 'mockMkDir#sync');
    assert.equal(
      mockMkdir.sync.firstCall.args[0],
      '/tmp/radiodan/log'
    );
  });

  it('creates paths relative to a given directory', function() {
    var mockPath = this.mockPath,
        mockMkdir = this.mockMkdir,
        paths = {music: '/tmp/radiodan/music'};

    subject(paths, '/etc/radiodan/', mockPath, mockMkdir);
  });

  it('does not create paths for non-specified attributes', function() {
    var mockPath = this.mockPath,
        mockMkdir = this.mockMkdir,
        noPaths = { dan: '/tmp/writehere' };

    assert.equal(mockMkdir.sync.callCount, 0);
    subject(noPaths, null, mockPath, mockMkdir);

    assert.equal(mockMkdir.sync.callCount, 0);
  });
});
