'use strict';

var mpdInvoker = require('../mpd/action');

mpdInvoker.methods['playlist.load'] = require('./actions/playlist/load');

module.exports = mpdInvoker;
