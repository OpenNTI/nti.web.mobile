'use strict';

var AppDispatcher = require('common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var Constants = require('./Constants');

var CHANGE_EVENT = 'change';

var getService = require('common/Utils').getService;

var Store = merge(EventEmitter.prototype, {
	displayName: 'enrollment.Store',

	emitChange: function(evt) {
		console.log(this.displayName + ': emitting change event');
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		console.log(this.displayName + ': adding change listener');
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	isEnrolled: function(/*courseId*/) {
		return false;
	}

});

function _enrollOpen(courseId) {
	getService().then(function(service) {
		var e = service.getEnrollment();
		e.enrollOpen(courseId).then(function(response) {
			console.debug(response);
			return response;
		});
	});
}

AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {
		case Constants.ENROLL_OPEN:
			_enrollOpen(action.course.getID());
		break;
		default:
			return true;
	}
	return true;
});


module.exports = Store;
