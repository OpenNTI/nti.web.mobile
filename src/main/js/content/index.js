'use strict';

var merge = require('react/lib/merge');
var view = require('./components/View');
var viewer = require('./components/Viewer');

var actions = require('./Actions');
var constants = require('./Constants');
var store = require('./Store');

module.exports = merge(exports, {

	View: view,
	Viewer: viewer,

	Actions: actions,
	Constants: constants,
	Store: store
});
