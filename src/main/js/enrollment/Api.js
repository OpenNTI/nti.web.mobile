import {getService} from 'nti-web-client';
import AppDispatcher from 'nti-lib-dispatcher';

import {RELOAD as RELOAD_LIBRARY} from 'library/Constants';

export async function getEnrollmentService () {
	const service = await getService();
	return service.getEnrollment();
}

export async function enrollOpen (catalogId) {
	const enrollmentService = await getEnrollmentService();
	const response = await enrollmentService.enrollOpen(catalogId);

	AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});

	return {
		serviceResponse: response,
		success: true
	};
}


export async function dropCourse (courseId) {
	const enrollmentService = await getEnrollmentService();
	const response = await enrollmentService.dropCourse(courseId);
	AppDispatcher.handleViewAction({type: RELOAD_LIBRARY});
	return response;
}
}
