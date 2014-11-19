'use strict';
/** @module catalog/Actions */


var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./Constants');



/**
 * Actions available to views for catalog-related functionality.
 */
module.exports = Object.assign(EventEmitter.prototype, {
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
	AppDispatcher.handleRequestAction(Object.assign( data, {
		type: key
	}));
}
