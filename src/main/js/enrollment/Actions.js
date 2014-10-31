'use strict';
/** @module catalog/Actions */
var merge = require('react/lib/merge');

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./Constants');

/**
 * Actions available to views for catalog-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {
	enrollOpen: function(course) {
		dispatch(Constants.ENROLL_OPEN, course);
	}
});

function dispatch(key, course) {
	AppDispatcher.handleRequestAction({
		actionType: key,
		course: course
	});
}
