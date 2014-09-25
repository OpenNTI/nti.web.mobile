'use strict';

var merge = require('react/lib/merge');
var view = require('./components/View');

var actions = require('./Actions');
var constants = require('./Constants');
var store = require('./Store');

module.exports = merge(exports, {

	View: view,

	Actions: actions,
	Constants: constants,
	Store: store
});
