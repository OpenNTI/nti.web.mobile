

import AppDispatcher from 'dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import * as Constants from './Constants';
import {CHANGE_EVENT} from 'common/constants/Events';

import {getService} from 'common/utils';

let enrollmentStatus = {};

let Store = Object.assign({}, EventEmitter.prototype, {
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
				enrollmentStatus[courseId] = result;
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
		if (enrollmentStatus.hasOwnProperty(courseId)) {
			return enrollmentStatus[courseId];
		}
		console.error('Enrollment status unknown. Maybe call loadEnrollmentStatus first.');
		return false;
	}

});


//TODO: move the bulk of the work/Async code to Api and Actions.
//The store (as a file) just listens for changes and updates local data.
function getEnrollmentService() {
	return getService().then(function(service) {
		return service.getEnrollment();
	});
}

function enrollOpen(catalogId) {
	return getEnrollmentService().then(function(enrollmentService) {
		return enrollmentService.enrollOpen(catalogId).then(function(result) {
			return {
				serviceResponse: result,
				success: true
			};
		});
	});
}

function dropCourse(courseId) {
	return getEnrollmentService().then(function(enrollmentService) {
		return enrollmentService.dropCourse(courseId);
	});
}

AppDispatcher.register(function(payload) {
	let action = payload.action;
	switch(action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case Constants.ENROLL_OPEN:
			enrollOpen(action.catalogId).then(function(result) {
				Store.emitChange({
					action: action,
					result: result
				});
			});
		break;
		case Constants.DROP_COURSE:
			dropCourse(action.courseId)
				.catch(error=>Object.assign(new Error(error.responseText), error))
				.then(result=>Store.emitChange({ action, result }));
		break;

		default:
			return true;
	}
	return true;
});


module.exports = Store;
