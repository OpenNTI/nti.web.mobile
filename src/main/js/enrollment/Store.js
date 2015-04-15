

var AppDispatcher = require('dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;


var Constants = require('./Constants');
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;

var {getService} = require('common/utils');

var _enrollmentStatus = {};

var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'enrollment.Store',

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	loadEnrollmentStatus: function(courseId) {
		return getService().then(function(service) {
			service.getEnrollment().isEnrolled(courseId).then(function(result) {
				_enrollmentStatus[courseId] = result;
				this.emitChange({
					action: {
						type: Constants.LOAD_ENROLLMENT_STATUS,
						courseId: courseId,
						result: result
					}
				});
			}.bind(this));
		}.bind(this));
	},

	isEnrolled: function(courseId) {
		if (_enrollmentStatus.hasOwnProperty(courseId)) {
			return _enrollmentStatus[courseId];
		}
		throw new Error('Enrollment status unknown. Maybe call loadEnrollmentStatus first.');
	}

});


//TODO: move the bulk of the work/Async code to Api and Actions.
//The store (as a file) just listens for changes and updates local data.
function _getEnrollmentService() {
	return getService().then(function(service) {
		return service.getEnrollment();
	});
}

function _enrollOpen(catalogId) {
	return _getEnrollmentService().then(function(enrollmentService) {
		return enrollmentService.enrollOpen(catalogId).then(function(result) {
			return {
				serviceResponse: result,
				success: true
			};
		});
	});
}

function _dropCourse(courseId) {
	return _getEnrollmentService().then(function(enrollmentService) {
		return enrollmentService.dropCourse(courseId);
	});
}

AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case Constants.ENROLL_OPEN:
			_enrollOpen(action.catalogId).then(function(result) {
				Store.emitChange({
					action: action,
					result: result
				});
			});
		break;
		case Constants.DROP_COURSE:
			_dropCourse(action.courseId)
				.catch(error=>Object.assign(new Error(error.responseText), error))
				.then(result=>Store.emitChange({ action, result }));
		break;

		default:
			return true;
	}
	return true;
});


module.exports = Store;
