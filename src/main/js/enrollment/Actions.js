'use strict';
/** @module catalog/Actions */
var merge = require('react/lib/merge');

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./Constants');

var merge = require('react/lib/merge');

/**
 * Actions available to views for catalog-related functionality.
 */
module.exports = merge(EventEmitter.prototype, {
	enrollOpen: function(catalogId) {
		dispatch(Constants.ENROLL_OPEN, {
			catalogId: catalogId
		});
	},

	dropCourse: function(courseId) {
		dispatch(Constants.DROP_COURSE, {
			courseId: courseId
		});
	}
});

function dispatch(key, data) {
	AppDispatcher.handleRequestAction(merge( data, {
		type: key
	}));
}
