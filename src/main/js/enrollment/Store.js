import AppDispatcher from 'dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import * as Constants from './Constants';
import * as Api from './Api';
import {CHANGE_EVENT} from 'common/constants/Events';

import {getService} from 'common/utils';

let enrollmentStatus = {};

let Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'enrollment.Store',

	emitChange (evt) {
		this.emit(CHANGE_EVENT, evt);
	},


	addChangeListener (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	flushEnrollmentStatus () {
		enrollmentStatus = {};
	},

	removeChangeListener (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	loadEnrollmentStatus (courseId) {
		return getService().then(service => {
			service.getEnrollment().isEnrolled(courseId).then(result => {
				enrollmentStatus[courseId] = result;
				this.emitChange({
					action: {
						type: Constants.LOAD_ENROLLMENT_STATUS,
						courseId: courseId,
						result: result
					}
				});
			});
		});
	},

	isEnrolled (courseId) {
		if (enrollmentStatus.hasOwnProperty(courseId)) {
			return enrollmentStatus[courseId];
		}
		return false;
	}

});




AppDispatcher.register(function (payload) {
	let action = payload.action;
	switch(action.type) {
	//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
	case Constants.ENROLL_OPEN:
		Api.enrollOpen(action.catalogId)
			.then(result => {
				Store.flushEnrollmentStatus();
				Store.emitChange({
					action: action,
					result: result
				});
			});
		break;
	case Constants.DROP_COURSE:
		Api.dropCourse(action.courseId)
			.catch(error=>Object.assign(new Error(error.responseText), error))
			.then(result => {
				Store.flushEnrollmentStatus();
				Store.emitChange({ action, result });
			});
		break;

	default:
		return true;
	}
	return true;
});


export default Store;
