'use strict';


var view = require('./components/View');

var actions = require('./Actions');
var constants = require('./Constants');
var store = require('./Store');

module.exports = Object.assign(exports, {
	Actions: actions,
	Constants: constants,
	Store: store,
	View: view
});
