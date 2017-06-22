import EventEmitter from 'events';

import AppDispatcher from 'nti-lib-dispatcher';
import {CHANGE_EVENT} from 'nti-lib-store';
import {getService} from 'nti-web-client';

import * as Constants from './Constants';
import * as Api from './Api';


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

const handlers = {
	[Constants.DROP_COURSE]: action => {
		Api.dropCourse(action.courseId)
			.catch(error => Object.assign(new Error(error.responseText), error))
			.then(result => {
				Store.flushEnrollmentStatus();
				Store.emitChange({ action, result });
			});
	}
};

AppDispatcher.register(function (payload) {
	let action = payload.action;
	const handler = handlers[action.type];
	handler && handler(action);
	return true;
});


export default Store;
