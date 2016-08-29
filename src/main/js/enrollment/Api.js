import {getService} from 'nti-web-client';

import AppDispatcher from 'nti-lib-dispatcher';
import {RELOAD as RELOAD_LIBRARY} from 'library/Constants';

export function getEnrollmentService () {
	return getService().then(service => service.getEnrollment());
}

export function enrollOpen (catalogId) {
	return getEnrollmentService().then(enrollmentService =>
		enrollmentService.enrollOpen(catalogId)
			.then( (response) => {
				AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});
				return response;
			})
			.then(result => ({ serviceResponse: result, success: true })));
}

export function dropCourse (courseId) {
	try {
		return getEnrollmentService()
			.then(enrollmentService => enrollmentService.dropCourse(courseId))
			.then( (response) => {
				AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});
				return response;
			});
	}
	catch(err) {
		return Promise.reject(err);
	}
}
