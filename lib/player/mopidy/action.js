'use strict';

var Invoker       = require('../../invoker'),
    validator     = require('../../validators/action'),
    actions       = require('../mpd/actions');

actions['playlist.load'] = require('./actions/playlist/load');

module.exports = Invoker.create(actions, validator);
