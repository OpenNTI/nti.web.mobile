'use strict';

var merge = require('react/lib/merge');

var collection = require('./components/Collection');
var detail = require('./components/Detail');

var actions = require('./Actions');
var constants = require('./Constants');
var store = require('./Store');

module.exports = merge(exports, {

	Actions: actions,
	Constants: constants,
	Store: store,

	Collection: collection,
	Detail: detail
});
