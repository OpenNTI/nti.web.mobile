'use strict';

var merge = require('react/lib/merge');

var view = require('./components/View');
var collection = require('./components/Collection');
var detail = require('./components/Detail');

var actions = require('./Actions');
var constants = require('./Constants');
var store = require('./Store');

module.exports = merge(exports, {

	Actions: actions,
	Constants: constants,
	Store: store,

	View: view,
	Collection: collection,
	Detail: detail
});
