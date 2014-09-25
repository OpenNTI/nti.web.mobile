'use strict';

var actions = require('./Actions');
var constants = require('./Constants');
var store = require('./Store');
var navrecord = require('./NavRecord');

module.exports = {
	Router: require('./components/Router'),
	Actions: actions,
	Constants: constants,
	Store: store,
	NavRecord: navrecord
};
