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

	isEnrolled: function(courseId) {
		return getService().then(function(service) {
			return service.getEnrollment().isEnrolled(courseId);
		});
	}

});

function _getEnrollment() {
	return getService().then(function(service) {
		return service.getEnrollment();
	});
}

function _enrollOpen(catalogId) {
	return _getEnrollment().then(function(enrollment) {
		return enrollment.enrollOpen(catalogId).then(function(response) {
			return response;
		});
	});
}

function _dropCourse(courseId) {
	return _getEnrollment().then(function(enrollment) {
		return enrollment.dropCourse(courseId);
	});
}

AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.actionType) {
		case Constants.ENROLL_OPEN:
			_enrollOpen(action.catalogId).then(function(result) {
				Store.emitChange({
					action: action,
					result: result
				})
			});
		break;
		case Constants.DROP_COURSE:
			_dropCourse(action.courseId).then(function(result) {
				Store.emitChange({
					action: action,
					result: result
				})
			});
		break;
		default:
			return true;
	}
	return true;
});


module.exports = Store;
