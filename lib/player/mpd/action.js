'use strict';

var Invoker       = require('../../invoker'),
    validator     = require('../../validators/action'),
    actions       = require('./actions');

module.exports = Invoker.create(actions, validator);
